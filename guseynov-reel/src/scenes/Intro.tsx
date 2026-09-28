import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {body, C, chroma, clamp, display} from '../theme';

const FIRST = 'GUSEYN'.split('');

export const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const line = interpolate(frame, [0, 10], [0, 1], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});
	const open = interpolate(frame, [8, 20], [0, 1], {
		...clamp,
		easing: Easing.out(Easing.exp),
	});
	const rays = interpolate(frame, [12, 26], [0, 0.4], clamp);
	const shake =
		interpolate(frame, [14, 38], [16, 0], clamp) * Math.sin(frame * 2.3);
	const zoom = interpolate(frame, [0, 75], [1.12, 1]);

	const second = spring({
		frame: frame - 38,
		fps,
		config: {damping: 14, stiffness: 120},
	});
	const tag = interpolate(frame, [4, 30], [0, 1], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: C.ink, overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					opacity: rays,
					background: `repeating-conic-gradient(from ${frame * 1.2}deg at 50% 50%, ${C.violet} 0deg 5deg, transparent 5deg 15deg)`,
					maskImage: 'radial-gradient(circle, black 10%, transparent 70%)',
					WebkitMaskImage:
						'radial-gradient(circle, black 10%, transparent 70%)',
				}}
			/>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					transform: `scale(${zoom}) translate(${shake}px, ${shake * 0.6}px)`,
				}}
			>
				<div
					style={{
						position: 'absolute',
						width: `${line * 100}%`,
						height: 4 + open * 440,
						background: `linear-gradient(90deg, ${C.violet}, ${C.pink} 60%, ${C.yellow})`,
						boxShadow: `0 0 ${60 + open * 80}px ${C.pink}`,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						top: 150,
						fontFamily: body,
						fontWeight: 900,
						fontSize: 36,
						color: C.white,
						letterSpacing: interpolate(tag, [0, 1], [70, 16]),
						opacity: tag,
					}}
				>
					SHOWREEL ’26
				</div>
				<div style={{display: 'flex', position: 'relative', top: -20}}>
					{FIRST.map((ch, i) => {
						const s = spring({
							frame: frame - 14 - i * 3,
							fps,
							config: {damping: 11, stiffness: 190},
						});
						return (
							<span
								key={i}
								style={{
									fontFamily: display,
									fontSize: 330,
									lineHeight: 1,
									color: C.white,
									display: 'inline-block',
									opacity: s > 0.01 ? 1 : 0,
									transform: `translateY(${(1 - s) * -520}px) rotate(${(1 - s) * (i % 2 ? 25 : -25)}deg)`,
									textShadow: chroma(interpolate(s, [0, 1], [34, 5])),
								}}
							>
								{ch}
							</span>
						);
					})}
				</div>
				<div
					style={{
						position: 'absolute',
						bottom: 190,
						fontFamily: display,
						fontSize: 150,
						letterSpacing: 40,
						color: 'transparent',
						WebkitTextStroke: `3px ${C.yellow}`,
						transform: `translateX(${(1 - second) * 1400}px)`,
					}}
				>
					GUSEYNOV
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
