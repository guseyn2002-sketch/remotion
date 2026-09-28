import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Finale} from './scenes/Finale';
import {Intro} from './scenes/Intro';
import {Stats} from './scenes/Stats';
import {Tour} from './scenes/Tour';
import {Words} from './scenes/Words';
import {C} from './theme';

const SCENES = [
	{component: Intro, duration: 75},
	{component: Words, duration: 90},
	{component: Stats, duration: 105},
	{component: Tour, duration: 90},
	{component: Finale, duration: 90},
];

export const REEL_DURATION = SCENES.reduce((a, s) => a + s.duration, 0);

const WIPE = 18;
const WIPE_COLORS = [C.yellow, C.pink, C.violet];

// Three skewed bars sweep across; the cut underneath happens while they cover the frame
const Wipe: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{WIPE_COLORS.map((color, i) => (
				<div
					key={color}
					style={{
						position: 'absolute',
						top: '-20%',
						height: '140%',
						width: width * 2.2,
						background: color,
						transform: `translateX(${interpolate(frame - i * 2, [0, 14], [-width * 2.2, width], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}px) skewX(-18deg)`,
					}}
				/>
			))}
		</AbsoluteFill>
	);
};

const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{opacity: 0.14, mixBlendMode: 'overlay'}}>
			<svg width="100%" height="100%">
				<filter id="grain">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.85"
						numOctaves="2"
						seed={frame % 12}
						stitchTiles="stitch"
					/>
				</filter>
				<rect width="100%" height="100%" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};

export const Reel: React.FC = () => {
	let from = 0;
	const scenes = SCENES.map(({component: Scene, duration}, i) => {
		const start = from;
		from += duration;
		return (
			<Sequence key={i} from={start} durationInFrames={duration}>
				<Scene />
			</Sequence>
		);
	});

	const cuts: number[] = [];
	SCENES.slice(0, -1).reduce((acc, s) => {
		cuts.push(acc + s.duration);
		return acc + s.duration;
	}, 0);

	return (
		<AbsoluteFill style={{backgroundColor: C.ink}}>
			{scenes}
			{cuts.map((cut) => (
				<Sequence key={cut} from={cut - 9} durationInFrames={WIPE}>
					<Wipe />
				</Sequence>
			))}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55))',
				}}
			/>
			<Grain />
		</AbsoluteFill>
	);
};
