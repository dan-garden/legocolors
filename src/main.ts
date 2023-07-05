import shadesOf from './lib/tailwind-shades.js';
import tinycolor from 'tinycolor2';
const { default: colors } = await import("./colors.json", {
  assert: {
    type: "json",
  },
});

export type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
}

export type ExternalIDType = {
    ext_ids: Array<string | number>
}

export type Keys = {
    camel: string;
    constant: string;
    snake: string;
    id: number | string;
    slug: string;
}

export type Color = {
    id: number | string;
    name: string;
    type: string;
    slug: string;
    keys: Keys;
    hex: string;
    rgb: RGBA | tinycolor.ColorFormats.RGBA;
    externalIds: {
        BrickLink?: ExternalIDType;
        BrickOwl?: ExternalIDType;
        LDraw?: ExternalIDType;
        LEGO?: ExternalIDType;
        Peeron?: ExternalIDType;
        Rebrickable?: ExternalIDType;
    };
}

class Colors {
    colors: { [key: string|number]: Color };
    colorsArray: Color[];

    constructor() {
        this.colors = colors.all;
        this.colorsArray = colors.unique;
    }

    getColors(): {
        [key: string]: Color;
        [key: number]: Color;
    } {
        return this.colors;
    }

    getTailwind(): {
        [key: string]: {
            DEFAULT: string;
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
    } {
        const colors = {};
        const caseKey = 'camel';
        
        this.colorsArray.forEach(color => {
            colors[`${color.keys[caseKey]}`] = {
                DEFAULT: color.hex,
                ...shadesOf(color.hex)
            }
        });

        return colors;
    }

    getColor(name: string): Color {
        return this.colorsArray.find(color => {
            return color.name.toLocaleLowerCase() === name.toLocaleLowerCase();
        });
    }

    getUniqueColors(): Color[] {
        return this.colorsArray;
    }

    getById(id: string | number): Color {
        return this.colorsArray.find(color => {
            return color.id === id;
        });
    }

    getByLegoId(id: number): Color {
        return this.getById(id);
    }

    getByRebrickableId(id: number): Color {
        return this.colorsArray.find(color => {
            return color?.externalIds?.Rebrickable?.ext_ids.includes(id);
        });
    }

    getByLDrawId(id: number): Color {
        return this.colorsArray.find(color => {
            return color?.externalIds?.LDraw?.ext_ids.includes(id);
        });
    }

    getByBrickLinkId(id: number): Color {
        return this.colorsArray.find(color => {
            return color?.externalIds?.BrickLink?.ext_ids.includes(id);
        });
    }

    getByBrickOwlId(id: number): Color {
        return this.colorsArray.find(color => {
            return color?.externalIds?.BrickOwl?.ext_ids.includes(id);
        });
    }
}

const ColorsInstance = new Colors();
export default ColorsInstance;
