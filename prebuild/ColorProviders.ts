import Colors_Base from "./providers/Colors_Base.js";
import Colors_Rebrickable from "./providers/Colors_Rebrickable.js";
import Colors_RyanHowerter from "./providers/Colors_RyanHowerter.js";
import { Color } from "../src/main.js";
import fs from 'fs';

class ColorProviders {
    providers: (typeof Colors_Base)[];
    colors: Color[];

    constructor() {
        this.providers = [
            Colors_Base,
            Colors_Rebrickable,
            Colors_RyanHowerter
        ];

        this.colors = [];
    }

    async buildColorJSON() {
        return new Promise(async (resolve) => {

            for(let i = 0; i < this.providers.length; i++) {
                const provider = this.providers[i];
                let colors = await provider.getColors();
                colors.forEach((color: Color) => {
                    color.type = color?.type.toLocaleLowerCase() || "solid";
                    

                    const existingColor = this.colors.find(c => {
                        return c.id === color.id
                            || c.name.toLocaleLowerCase().trim() === color.name.toLocaleLowerCase().trim();
                    });

                    if (existingColor) {
                        // merge all properties
                        existingColor.name = color.name || existingColor.name;
                        existingColor.rgb = color.rgb || existingColor.rgb;
                        existingColor.hex = color.hex || existingColor.hex;
                        existingColor.type = color.type || existingColor.type;
                        existingColor.desc = color.desc || existingColor.desc;

                        existingColor.providers = [
                            ...existingColor?.providers || [],
                            ...color?.providers || []
                        ];

                        existingColor.externalIds = {
                            ...existingColor.externalIds,
                            ...color.externalIds
                        };

                        existingColor.keys = {
                            ...existingColor.keys,
                            ...color.keys
                        };

                    } else {
                        this.colors.push(color);
                    }
                });

                colors = colors.map((color: Color) => {

                    if(color.name.startsWith("Glitter")) {
                        color.type = "glitter";
                    }

                    if(color.name.startsWith("Satin")) {
                        color.type = "satin";
                    }

                    if(color.name.startsWith("Metallic")) {
                        color.type = "metallic";
                    }

                    if(color.name.startsWith("Speckle")) {
                        color.type = "speckle";
                    }

                    const missingTypes = [
                        {
                            key: "satin"
                        },
                        {
                            key: "glitter"
                        },
                        {
                            key: "transparent",
                            alt: "trans-"
                        },
                        {
                            key: "chrome"
                        },
                        {
                            key: "metallic"
                        },
                        {
                            key: "modulex"
                        },
                    ];

                    const matchingType = missingTypes.find(r => r.key === color.type);
                    if(matchingType && !color.hex) {
                        
                        const nameWithoutType = color.name.toLowerCase().replace(matchingType.alt || color.type, "").trim();

                        const existingColor = this.colors.find(c => {
                            return c.id === color.id
                                || c.name.toLocaleLowerCase().trim() === nameWithoutType;
                        });
                        
                        if(existingColor) {
                            color.hex = existingColor.hex;
                            color.rgb = existingColor.rgb;
                        }
                    }

                    return color;
                });
            }

            resolve(this.colors);
        });
    }

    static buildColorKeys(colorArray: Color[]) {
        const colors = {
            unique: colorArray,
            all: Object.fromEntries(colorArray.map(color => [color.id, color]))
        };
        
        colorArray.forEach(color => {
            Object.values(color.keys).forEach((key: string | number) => {
                colors.all[key] = color;
            });
        });

        return colors;
    }

    static async writeFile(colors: { unique: Color[]; all: {}; }) {
        return new Promise<void>(async (resolve) => {
            fs.writeFile('src/colors.json', JSON.stringify(colors, null, 4), 'utf8', () => {
                resolve();
            });
        });
    }
}

export default ColorProviders;