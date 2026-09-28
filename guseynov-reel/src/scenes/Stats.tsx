import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {body, C, clamp, display} from '../theme';

const CARDS = [
	{
		value: 12.4,
		decimals: 1,
		prefix: '',
		suffix: 'B',
		label: 'STREAMS',
		from: C.pink,
		to: C.violet,
	},
	{
		value: 97,
		decimals: 0,
		prefix: '#1 IN ',
		suffix: '',
		label: 'COUNTRIES',
		from: C.yellow,
		to: C.pink,
	},
	{
		value: 48,
		decimals: 0,
		prefix: '',
		suffix: '',
		label: 'SOLD-OUT STADIUMS',
		from: C.cyan,
		to: C.violet,
	},
];

export const Stats: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const heading = spring({frame, fps, config: {damping: 16, stiffness: 140}});

	return (
		<AbsoluteFill style={{backgroundColor: C.ink, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					left: '-50%',
					width: '200%',
					top: '45%',
					height: '120%',
					transformOrigin: '50% 0%',
					transform: 'perspective(700px) rotateX(62deg)',
					backgroundImage: `linear-gradient(${C.violet} 2px, transparent 2px), linear-gradient(90deg, ${C.violet} 2px, transparent 2px)`,
					backgroundSize: '90px 90px',
					backgroundPosition: `0 ${frame * 6}px`,
					opacity: 0.55,
					maskImage: 'linear-gradient(transparent, black 30%)',
					WebkitMaskImage: 'linear-gradient(transparent, black 30%)',
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse at 50% 45%, ${C.pink}33, transparent 60%)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 80,
					width: '100%',
					textAlign: 'center',
					overflow: 'hidden',
					height: 140,
				}}
			>
				<div
					style={{
						fontFamily: display,
						fontSize: 120,
						lineHeight: 1.15,
						color: C.white,
						letterSpacing: 10,
						transform: `translateY(${(1 - heading) * 150}px)`,
					}}
				>
					BY THE <span style={{color: C.yellow}}>NUMBERS</span>
				</div>
			</div>
			<AbsoluteFill
				style={{
					top: 150,
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 60,
					perspective: 1400,
				}}
			>
				{CARDS.map((card, i) => {
					const start = 8 + i * 8;
					const s = spring({
						frame: frame - start,
						fps,
						config: {damping: 14, stiffness: 110},
					});
					const count = interpolate(
						frame,
						[start, start + 45],
						[0, card.value],
						{...clamp, easing: Easing.out(Easing.cubic)},
					);
					const float = Math.sin((frame + i * 20) / 14) * 10;
					return (
						<div
							key={card.label}
							style={{
								width: 500,
								height: 560,
								borderRadius: 32,
								background: `linear-gradient(145deg, ${card.from}, ${card.to})`,
								boxShadow: `0 40px 120px ${card.from}66`,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								opacity: s,
								transform: `translateY(${(1 - s) * 300 + float}px) rotateY(${(1 - s) * 95}deg)`,
								position: 'relative',
								overflow: 'hidden',
							}}
						>
							<div
								style={{
									position: 'absolute',
									inset: 0,
									background:
										'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%)',
									transform: `translateX(${interpolate(frame, [start + 20, start + 55], [-600, 600], clamp)}px)`,
								}}
							/>
							{card.prefix ? (
								<div
									style={{
										fontFamily: body,
										fontWeight: 900,
										fontSize: 52,
										color: C.ink,
										letterSpacing: 4,
									}}
								>
									{card.prefix.trim()}
								</div>
							) : null}
							<div
								style={{
									fontFamily: display,
									fontSize: 230,
									lineHeight: 1,
									color: C.white,
									textShadow: `6px 6px 0 ${C.ink}`,
									fontVariantNumeric: 'tabular-nums',
								}}
							>
								{count.toFixed(card.decimals)}
								{card.suffix}
							</div>
							<div
								style={{
									marginTop: 20,
									fontFamily: body,
									fontWeight: 900,
									fontSize: 40,
									color: C.ink,
									letterSpacing: 4,
									textAlign: 'center',
									padding: '0 30px',
								}}
							>
								{card.label}
							</div>
							<div
								style={{
									position: 'absolute',
									bottom: 40,
									left: 50,
									right: 50,
									height: 10,
									borderRadius: 5,
									background: 'rgba(0,0,0,0.25)',
								}}
							>
								<div
									style={{
										height: '100%',
										borderRadius: 5,
										background: C.white,
										width: `${(count / card.value) * 100}%`,
									}}
								/>
							</div>
						</div>
					);
				})}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
