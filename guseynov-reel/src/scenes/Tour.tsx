import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {body, C, chroma, display} from '../theme';

const CITIES =
	'LONDON ★ TOKYO ★ BAKU ★ NEW YORK ★ PARIS ★ SEOUL ★ RIO ★ DUBAI ★ ';
const BARS = 56;

export const Tour: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();

	const vinyl = spring({frame, fps, config: {damping: 16, stiffness: 90}});
	const title = spring({
		frame: frame - 6,
		fps,
		config: {damping: 13, stiffness: 150},
	});
	const year = spring({
		frame: frame - 14,
		fps,
		config: {damping: 10, stiffness: 170},
	});

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 30% 50%, ${C.pink}, ${C.violet} 55%, ${C.ink})`,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 30,
					left: -100,
					width: width + 200,
					height: 90,
					background: C.yellow,
					transform: 'rotate(-3deg)',
					display: 'flex',
					alignItems: 'center',
					overflow: 'hidden',
					boxShadow: `0 10px 0 ${C.ink}`,
				}}
			>
				<div
					style={{
						whiteSpace: 'nowrap',
						fontFamily: display,
						fontSize: 64,
						color: C.ink,
						letterSpacing: 6,
						transform: `translateX(${-((frame * 14) % 1800)}px)`,
					}}
				>
					{CITIES.repeat(6)}
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: 180,
					top: 230,
					width: 640,
					height: 640,
					transform: `translateX(${(1 - vinyl) * -900}px) rotate(${frame * 7}deg)`,
					borderRadius: '50%',
					background:
						'repeating-radial-gradient(circle, #111 0 3px, #1d1d24 3px 6px)',
					boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 0 6px ${C.ink}`,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						width: 240,
						height: 240,
						borderRadius: '50%',
						background: `linear-gradient(135deg, ${C.yellow}, ${C.pink})`,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						fontFamily: display,
						fontSize: 110,
						color: C.ink,
					}}
				>
					GG
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 180,
					top: 230,
					width: 640,
					height: 640,
					borderRadius: '50%',
					transform: `translateX(${(1 - vinyl) * -900}px)`,
					background:
						'conic-gradient(from 30deg, transparent 0deg, rgba(255,255,255,0.18) 20deg, transparent 50deg, transparent 180deg, rgba(255,255,255,0.12) 210deg, transparent 240deg)',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					left: 930,
					top: 260,
					fontFamily: body,
					fontWeight: 900,
					fontSize: 36,
					color: C.yellow,
					letterSpacing: 10,
					opacity: title,
				}}
			>
				NOW ANNOUNCING
			</div>
			<div
				style={{
					position: 'absolute',
					left: 920,
					top: 300,
					fontFamily: display,
					fontSize: 200,
					lineHeight: 1,
					color: C.white,
					textShadow: chroma(5),
					transform: `translateX(${(1 - title) * 1200}px)`,
				}}
			>
				WORLD TOUR
			</div>
			<div
				style={{
					position: 'absolute',
					left: 920,
					top: 500,
					fontFamily: display,
					fontSize: 260,
					lineHeight: 1,
					color: 'transparent',
					WebkitTextStroke: `4px ${C.yellow}`,
					transform: `scale(${interpolate(year, [0, 1], [2.5, 1])})`,
					transformOrigin: 'left center',
					opacity: year,
				}}
			>
				2026
			</div>

			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: 240,
					display: 'flex',
					alignItems: 'flex-end',
					gap: 8,
					padding: '0 12px',
				}}
			>
				{new Array(BARS).fill(true).map((_, i) => {
					const h =
						20 +
						Math.abs(
							Math.sin(frame * 0.32 + i * 0.7) *
								Math.cos(frame * 0.11 + i * 1.3),
						) *
							200 *
							vinyl;
					return (
						<div
							key={i}
							style={{
								flex: 1,
								height: h,
								borderRadius: '8px 8px 0 0',
								background: `linear-gradient(${C.yellow}, ${C.cyan})`,
								opacity: 0.85,
							}}
						/>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
