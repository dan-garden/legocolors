export default function shadesOf(hex: string, halfShades = false): {[key: number]: string} {
    const baseColor: number[] = hexToRgbArray(hex);
    const black: number[] = [0, 0, 0];
    const white: number[] = [255, 255, 255];

    let shades: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    if(halfShades) shades = [...shades, 150, 250, 350, 450, 550, 650, 750, 850].sort((a,b) => a - b);

    const result: {[key: number]: string} = {};

    for(let shade of shades) {
        const originalShade: number = shade;

        if(shade === 500) {
            result[shade] = hex;
            continue;
        }

        const isDarkShade: boolean = shade > 500;
        if(isDarkShade) shade -= 500;

        const percentage: number = shade / 500;
        const startColor: number[] = isDarkShade ? black : baseColor;
        const endColor: number[] = isDarkShade ? baseColor : white;

        result[originalShade] = getColor(percentage, startColor, endColor);
    }

    return result;
}

function hexToRgbArray(hex: string): number[] {
    const originalHex: string = hex;

    hex = hex.replace('#', '');
    if(hex.length === 3) hex = hex + hex;

    const r: string = hex.substring(0, 2);
    const g: string = hex.substring(2, 4);
    const b: string = hex.substring(4, 6);

    const rgb: number[] = [r, g, b].map(channel => {
        let channelNumber: number;
        try {
            channelNumber =  parseInt(channel, 16);
            if(channelNumber < 0 || channelNumber > 255) throw new Error;
            return channelNumber;
        } catch {
            throw new Error(`Invalid hex color provided: ${originalHex}`);
        }
    });

    return rgb;
}

function getColor(percentage: number, start: number[], end: number[]): string {
    const rgb: number[] = end.map((channel, index) => {
        return Math.round(channel + percentage * (start[index] - channel));
    });

    const hex: string = '#' + rgb.map(channel => {
        const component: string = channel.toString(16);
        if(component.length === 1) return '0' + component;
        return component;
    }).join('');
    return hex;
}