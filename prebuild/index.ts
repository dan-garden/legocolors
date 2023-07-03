import Colors_Base from "./providers/Colors_Base.js";
import Colors_Rebrickable from "./providers/Colors_Rebrickable.js";
import Colors_RyanHowerter from "./providers/Colors_RyanHowerter.js";
import { Color } from "../src/main.js";

class UpdateColors {
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
                const colors = await provider.getColors();
                colors.forEach((color: Color) => {
                    const existingColor = this.colors.find(c => {
                        return c.id === color.id || (c.keys.slug === color.keys.slug);
                    });

                    if (existingColor) {
                        // merge all properties
                        existingColor.name = color.name || existingColor.name;
                        existingColor.rgb = color.rgb || existingColor.rgb;
                        existingColor.hex = color.hex || existingColor.hex;

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
            }

            resolve(this.colors);
        });
    }
}

const updateColors = new UpdateColors();
updateColors.buildColorJSON().then(() => {
    const colors = Colors_Base.buildColorKeys(updateColors.colors);
    Colors_Base.writeFile(colors);
    console.log("Colors updated");
});
