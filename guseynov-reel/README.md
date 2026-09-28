# Guseyn Guseynov — biggest pop star

A 15-second motion graphics showreel (1920×1080, 30 fps) built with Remotion.
Standalone project — it uses Remotion from npm, not the monorepo packages.

Scenes: name slam intro → "THE BIGGEST POP STAR" kinetic typography → stat cards → world tour vinyl + equalizer → star finale with confetti.

```bash
npm i
npm run dev      # preview in Remotion Studio
npm run render   # out/guseynov-reel.mp4
```

In sandboxes where Remotion can't download Chrome, pass a local one:
`npm run render -- --browser-executable=/path/to/headless_shell`

Fonts (Anton, Inter — SIL OFL) are bundled in `public/fonts` so rendering works offline.
