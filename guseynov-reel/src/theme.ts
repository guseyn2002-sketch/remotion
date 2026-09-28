import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts are bundled in public/ so rendering works offline (Anton + Inter, both OFL)
export const display = 'Anton';
export const body = 'Inter';

loadFont({family: display, url: staticFile('fonts/Anton-Regular.woff2')});
loadFont({
	family: body,
	url: staticFile('fonts/Inter-latin.woff2'),
	weight: '100 900',
});

export const C = {
	pink: '#FF2E88',
	yellow: '#FFE600',
	cyan: '#00E5FF',
	violet: '#7B2CFF',
	ink: '#07060B',
	white: '#FFFFFF',
};

export const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

// RGB-split text shadow for that glitchy pop look
export const chroma = (offset: number) =>
	`${offset}px 0 ${C.pink}, ${-offset}px 0 ${C.cyan}`;
