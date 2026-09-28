import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {C, chroma, clamp, display} from '../theme';

const WORDS = [
	{text: 'THE', bg: C.yellow, fg: C.ink, stroke: C.pink},
	{text: 'BIGGEST', bg: C.pink, fg: C.white, stroke: C.yellow},
	{text: 'POP', bg: C.cyan, fg: C.ink, stroke: C.violet},
	{text: 'STAR', bg: C.violet, fg: C.yellow, stroke: C.cyan},
];
const BEAT = 15;

export const Words: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	if (frame < WORDS.length * BEAT) {
		const word = WORDS[Math.floor(frame / BEAT)];
		const f = frame % BEAT;
		const s = spring({frame: f, fps, config: {damping: 13, stiffness: 260}});
		const scale = interpolate(s, [0, 1], [1.9, 1]);
		const blur = interpolate(f, [0, 4], [18, 0], clamp);
		const flash = interpolate(f, [0, 3], [0.7, 0], clamp);

		return (
			<AbsoluteFill
				style={{
					backgroundColor: word.bg,
					justifyContent: 'center',
					alignItems: 'center',
					overflow: 'hidden',
				}}
			>
				{[4, 3, 2, 1].map((k) => (
					<div
						key={k}
						style={{
							position: 'absolute',
							fontFamily: display,
							fontSize: 460,
							color: 'transparent',
							WebkitTextStroke: `3px ${word.stroke}`,
							opacity: 0.55 - k * 0.1,
							transform: `scale(${scale + k * 0.22 + f * 0.01 * k})`,
						}}
					>
						{word.text}
					</div>
				))}
				<div
					style={{
						fontFamily: display,
						fontSize: 460,
						lineHeight: 1,
						color: word.fg,
						transform: `scale(${scale}) rotate(${(1 - s) * -6}deg)`,
						filter: `blur(${blur}px)`,
						textShadow: chroma(interpolate(s, [0, 1], [26, 6])),
					}}
				>
					{word.text}
				</div>
				<AbsoluteFill style={{backgroundColor: C.white, opacity: flash}} />
			</AbsoluteFill>
		);
	}

	const f = frame - WORDS.length * BEAT;
	const a = spring({frame: f, fps, config: {damping: 15, stiffness: 160}});
	const b = spring({frame: f - 4, fps, config: {damping: 15, stiffness: 160}});
	const flash = interpolate(f, [0, 4], [0.8, 0], clamp);
	const stripes = f * 14;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: C.ink,
				justifyContent: 'center',
				alignItems: 'center',
				overflow: 'hidden',
			}}
		>
			<AbsoluteFill
				style={{
					opacity: 0.18,
					background: `repeating-linear-gradient(-30deg, ${C.pink} 0 40px, transparent 40px 120px)`,
					backgroundPosition: `${stripes}px 0`,
				}}
			/>
			<div
				style={{
					fontFamily: display,
					fontSize: 210,
					lineHeight: 1,
					color: C.yellow,
					letterSpacing: 12,
					transform: `translateX(${(1 - a) * -1500}px)`,
				}}
			>
				THE BIGGEST
			</div>
			<div style={{position: 'relative'}}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						fontFamily: display,
						fontSize: 400,
						lineHeight: 1,
						color: 'transparent',
						WebkitTextStroke: `3px ${C.cyan}`,
						transform: `translate(${14 + (1 - b) * 1600}px, 14px)`,
					}}
				>
					POP STAR
				</div>
				<div
					style={{
						fontFamily: display,
						fontSize: 400,
						lineHeight: 1,
						color: C.pink,
						transform: `translateX(${(1 - b) * 1800}px)`,
						textShadow: chroma(5),
					}}
				>
					POP STAR
				</div>
			</div>
			<AbsoluteFill style={{backgroundColor: C.white, opacity: flash}} />
		</AbsoluteFill>
	);
};
