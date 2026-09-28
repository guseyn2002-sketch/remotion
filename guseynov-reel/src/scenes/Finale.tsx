import {
	AbsoluteFill,
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {body, C, chroma, clamp, display} from '../theme';

const CONFETTI_COLORS = [C.pink, C.yellow, C.cyan, C.violet, C.white];

const starPoints = (outer: number, inner: number) =>
	new Array(10)
		.fill(true)
		.map((_, i) => {
			const r = i % 2 === 0 ? outer : inner;
			const a = (Math.PI / 5) * i - Math.PI / 2;
			return `${Math.cos(a) * r},${Math.sin(a) * r}`;
		})
		.join(' ');

export const Finale: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const star = spring({frame, fps, config: {damping: 9, stiffness: 120}});
	const flash = interpolate(frame, [0, 10], [1, 0], clamp);
	const reveal = interpolate(frame, [12, 30], [0, 100], clamp);
	const tagline = interpolate(frame, [28, 50], [0, 1], clamp);

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 50% 38%, ${C.violet}, ${C.ink} 65%)`,
				overflow: 'hidden',
			}}
		>
			<AbsoluteFill
				style={{
					opacity: 0.25,
					background: `repeating-conic-gradient(from ${frame * -0.8}deg at 50% 36%, ${C.pink} 0deg 6deg, transparent 6deg 18deg)`,
				}}
			/>

			{[0, 1, 2].map((k) => {
				const t = ((frame + k * 12) % 36) / 36;
				return (
					<div
						key={k}
						style={{
							position: 'absolute',
							left: width / 2,
							top: height * 0.36,
							width: 300,
							height: 300,
							marginLeft: -150,
							marginTop: -150,
							borderRadius: '50%',
							border: `4px solid ${C.pink}`,
							transform: `scale(${0.8 + t * 3.5})`,
							opacity: (1 - t) * star * 0.8,
						}}
					/>
				);
			})}

			<svg
				width={560}
				height={560}
				viewBox="-280 -280 560 560"
				style={{
					position: 'absolute',
					left: width / 2 - 280,
					top: height * 0.36 - 280,
					transform: `scale(${star}) rotate(${(1 - star) * -220 + Math.sin(frame / 12) * 8}deg)`,
					filter: `drop-shadow(0 0 40px ${C.yellow})`,
				}}
			>
				<defs>
					<linearGradient id="starFill" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stopColor={C.yellow} />
						<stop offset="1" stopColor={C.pink} />
					</linearGradient>
				</defs>
				<polygon points={starPoints(230, 100)} fill="url(#starFill)" />
				<text
					x={0}
					y={42}
					textAnchor="middle"
					fontFamily={display}
					fontSize={120}
					fill={C.ink}
				>
					GG
				</text>
			</svg>

			<div
				style={{
					position: 'absolute',
					top: 690,
					width: '100%',
					textAlign: 'center',
					fontFamily: display,
					fontSize: 190,
					lineHeight: 1,
					color: C.white,
					letterSpacing: 6,
					textShadow: chroma(6),
					clipPath: `inset(0 ${100 - reveal}% 0 0)`,
				}}
			>
				GUSEYN GUSEYNOV
			</div>
			<div
				style={{
					position: 'absolute',
					top: 690,
					height: 190,
					width: 14,
					left: `${reveal}%`,
					background: C.yellow,
					boxShadow: `0 0 40px ${C.yellow}`,
					opacity: reveal > 0 && reveal < 100 ? 1 : 0,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 910,
					width: '100%',
					textAlign: 'center',
					fontFamily: body,
					fontWeight: 900,
					fontSize: 48,
					color: C.yellow,
					letterSpacing: interpolate(tagline, [0, 1], [40, 14]),
					opacity: tagline,
				}}
			>
				THE BIGGEST POP STAR ON THE PLANET
			</div>

			{new Array(90).fill(true).map((_, i) => {
				const delay = random(`d${i}`) * 60;
				const t = Math.max(0, frame - 4 - delay);
				const x =
					random(`x${i}`) * width + Math.sin(t / 8 + i) * 40;
				const y = -60 + t * t * 0.12 + t * (4 + random(`v${i}`) * 6);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: 14,
							height: 26,
							background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
							transform: `rotate(${t * (8 + random(`r${i}`) * 12)}deg) scaleX(${Math.cos(t / 3 + i)})`,
							opacity: t > 0 ? 1 : 0,
						}}
					/>
				);
			})}

			<AbsoluteFill style={{backgroundColor: C.white, opacity: flash}} />
		</AbsoluteFill>
	);
};
