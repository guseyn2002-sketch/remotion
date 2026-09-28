"""Generates the voiceover and the background track for the reel.

Voice: Kokoro TTS (Apache-2.0), American female voice.
Music: synthesized from scratch with numpy (120 BPM = one beat per 15 frames at 30 fps).
Writes public/voice/*.wav, public/music.wav and src/audio-timeline.json.

    pip install kokoro-onnx soundfile scipy
    python3 scripts/make_audio.py   # expects model files in .tts-models/
"""

import json
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
from scipy.signal import butter, lfilter

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
DURATION = 15.0
SR = 44100
BEAT = 0.5  # 120 BPM
VOICE = "af_bella"

# file, text, start frame, speed, text is phonemes
LINES = [
    ("01-ladies", "Ladies and gentlemen...", 6, 1.0, False),
    ("02-the", "The", 76, 1.0, False),
    ("03-biggest", "biggest.", 90, 1.0, False),
    ("04-pop", "Pop!", 105, 1.0, False),
    ("05-star", "Star!", 120, 1.0, False),
    ("06-numbers", "Twelve billion streams. Number one in ninety seven countries.", 171, 1.15, False),
    ("07-tour", "Now announcing... the world tour!", 277, 1.05, False),
    ("08-name", "ɡusˈeɪn ɡusˈeɪnəf!", 372, 0.95, True),
]


def trim(a, thr=0.01):
    idx = np.where(np.abs(a) > thr)[0]
    return a[max(0, idx[0] - 200) : idx[-1] + 2400] if len(idx) else a


def make_voice():
    k = Kokoro(str(ROOT / ".tts-models/kokoro-v1.0.int8.onnx"), str(ROOT / ".tts-models/voices-v1.0.bin"))
    out_dir = ROOT / "public/voice"
    out_dir.mkdir(parents=True, exist_ok=True)
    for f in out_dir.glob("*.wav"):
        f.unlink()
    placed = []
    for name, text, start, speed, is_ph in LINES:
        a, sr = k.create(text, voice=VOICE, speed=speed, lang="en-us", is_phonemes=is_ph)
        a = trim(a)
        if name == "08-name":
            # stadium-style echo tail
            out = np.concatenate([a, np.zeros(int(sr * 1.2), dtype=a.dtype)])
            for d, g in [(0.18, 0.45), (0.36, 0.25), (0.54, 0.12)]:
                o = int(sr * d)
                out[o : o + len(a)] += a * g
            a = out
        a = a / max(1e-6, np.abs(a).max()) * 0.85
        sf.write(out_dir / f"{name}.wav", a, sr)
        placed.append((start / FPS, a, sr))
        print(f"{name}: {len(a) / sr:.2f}s @ {start / FPS:.2f}s")
    return placed


# ---------- synth helpers ----------
N = int(DURATION * SR)
t_all = np.arange(N) / SR


def note_hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, hz, order=2):
    b, a = butter(order, min(hz, SR / 2 - 100) / (SR / 2))
    return lfilter(b, a, x)


def hp(x, hz, order=2):
    b, a = butter(order, hz / (SR / 2), btype="high")
    return lfilter(b, a, x)


def saw(freq, n, phase=0.0):
    t = np.arange(n) / SR
    return 2 * ((t * freq + phase) % 1.0) - 1


def add(buf, at, x, gain=1.0):
    i = int(at * SR)
    if i >= N:
        return
    x = x[: N - i]
    buf[i : i + len(x)] += x * gain


rng = np.random.default_rng(7)


def kick():
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) + rng.standard_normal(n) * np.exp(-t * 400) * 0.3


def clap():
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    env = np.exp(-t * 18)
    for d in (0.0, 0.011, 0.022):
        env += np.where(t >= d, np.exp(-(t - d) * 180), 0) * 0.6
    return hp(lp(rng.standard_normal(n), 5000), 900) * env * 0.6


def hat(open_=False):
    n = int((0.22 if open_ else 0.05) * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-t * (14 if open_ else 90)) * 0.35


def pluck(freq, dur=0.22):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = saw(freq, n) + 0.5 * saw(freq * 2.003, n)
    return lp(x, 3500) * np.exp(-t * 16) * 0.25


def boom():
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    f = 32 + 90 * np.exp(-t * 9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 2.6)
    crash = hp(rng.standard_normal(n), 4000) * np.exp(-t * 2.2) * 0.35
    return body + crash


def whoosh(center):
    # filtered noise swelling into a cut
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    env = np.exp(-((t - 0.6) ** 2) / 0.02)
    x = hp(lp(x, 6000), 800) * env * 0.35
    return center - 0.6, x


def make_music(placed):
    drums = np.zeros(N)
    bass = np.zeros(N)
    pad = np.zeros(N)
    arp = np.zeros(N)
    fx = np.zeros(N)

    # Am - F - C - G, one chord per bar (2 s)
    chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
    roots = [45, 41, 48, 43]

    beats = int(DURATION / BEAT)
    for b in range(beats):
        at = b * BEAT
        bar = int(at // 2) % 4
        full = at >= 4.5
        hits = 2.5 <= at < 4.5  # word slams
        if full or hits:
            add(drums, at, kick(), 0.9)
        if full and b % 2 == 1 or hits:
            add(drums, at, clap(), 0.7 if full else 0.5)
        if full:
            add(drums, at + BEAT / 2, hat(open_=True), 0.8)
            for s in range(4):
                add(drums, at + s * BEAT / 4, hat(), 0.5 if s % 2 else 0.8)
        if at >= 2.5:
            # offbeat pumping bass
            for off in (0.25, 0.375) if full else (0.25,):
                n = int(0.12 * SR)
                env = np.exp(-np.arange(n) / SR * 20)
                add(bass, at + off, lp(saw(note_hz(roots[bar]), n), 900) * env, 0.5)
        if at >= 5.5:
            ch = chords[bar] + [chords[bar][0] + 12]
            octave = 24 if at >= 12 else 12
            for s in range(4):
                add(arp, at + s * BEAT / 4, pluck(note_hz(ch[(b * 4 + s) % 4] + octave)), 0.7)

    # supersaw pad, sidechained to the kick
    for bar in range(int(DURATION // 2) + 1):
        n = int(2 * SR)
        x = np.zeros(n)
        for m in chords[bar % 4]:
            for det in (-0.12, 0, 0.12):
                x += saw(note_hz(m) * 2 ** (det / 12), n, rng.random())
        add(pad, bar * 2, lp(x, 2400) * 0.06)
    pump = np.ones(N)
    for b in range(beats):
        at = b * BEAT
        if at >= 2.5:
            i = int(at * SR)
            seg = np.arange(int(BEAT * SR)) / SR
            pump[i : i + len(seg)] = 1 - 0.65 * np.exp(-seg * 9)
    # intro: pad fades in and opens up (a dark-to-bright crossfade stands in for a filter sweep)
    intro = np.clip(t_all / 2.3, 0, 1)
    pad = (lp(pad, 700) * (1 - intro) + pad * intro) * np.clip(t_all / 1.2, 0, 1)
    pad *= pump

    # intro riser into the first cut
    n = int(2.4 * SR)
    t = np.arange(n) / SR
    riser = hp(rng.standard_normal(n), 2000) * (t / 2.4) ** 3 * 0.25
    riser += np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / 2.4) ** 2) / SR) * (t / 2.4) ** 2 * 0.08
    add(fx, 0.1, riser)

    add(fx, 0.47, boom(), 0.6)  # first letter lands
    add(fx, 12.0, boom(), 0.9)  # finale
    for cut in (2.5, 5.5, 9.0, 12.0):
        s, x = whoosh(cut)
        add(fx, s, x)

    music = drums * 0.8 + bass + pad + arp + fx

    # final stab at 14 s, then fade out
    fade = np.clip((15.0 - t_all) / 0.4, 0, 1)
    music *= fade

    # duck under the voice
    env = np.zeros(N)
    for start, a, sr in placed:
        rms = np.sqrt(np.convolve(a**2, np.ones(int(sr * 0.03)) / int(sr * 0.03), mode="same"))
        src = np.interp(np.arange(int(len(a) / sr * SR)) / SR, np.arange(len(a)) / sr, rms)
        i = int(start * SR)
        seg = src[: N - i]
        env[i : i + len(seg)] = np.maximum(env[i : i + len(seg)], seg)
    env = np.clip(env / 0.08, 0, 1)
    smooth = np.zeros(N)
    atk, rel = np.exp(-1 / (SR * 0.01)), np.exp(-1 / (SR * 0.25))
    s = 0.0
    for i in range(N):
        c = atk if env[i] > s else rel
        s = c * s + (1 - c) * env[i]
        smooth[i] = s
    music *= 1 - 0.55 * smooth

    music = music / np.abs(music).max() * 0.55
    sf.write(ROOT / "public/music.wav", np.stack([music, music], axis=1), SR)
    print("music.wav written")


placed = make_voice()
make_music(placed)
(ROOT / "src/audio-timeline.json").write_text(
    json.dumps([{"file": name, "from": start} for name, _, start, _, _ in LINES], indent="\t") + "\n"
)
