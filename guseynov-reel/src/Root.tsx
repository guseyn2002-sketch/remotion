import {Composition} from 'remotion';
import {Reel, REEL_DURATION} from './Reel';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="GuseynovReel"
			component={Reel}
			durationInFrames={REEL_DURATION}
			fps={30}
			width={1920}
			height={1080}
		/>
	);
};
