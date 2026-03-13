import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'BbHexagonWave': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'bg-colors'?: string;
                'bg-angle'?: string;
                'hex-size'?: string;
                'wave-amplitude'?: string;
                'wave-speed'?: string;
                'wave-x-factor'?: string;
                'wave-y-factor'?: string;
                'base-lightness'?: string;
                'lightness-range'?: string;
                'hex-hue-start'?: string;
                'hex-hue-end'?: string;
                'hex-saturation'?: string;
                'hex-scale'?: string;
                'trail-opacity'?: string;
                'hex-colors'?: string;
                [key: string]: any;
            };
        }
    }
}
