import Colors_Base from "./Colors_Base.js";
import rebrick from 'rebrick';
import tinycolor from 'tinycolor2';
import {
    camelCase,
    constantCase,
    snakeCase
} from 'change-case';
import { Color } from '../../src/main.js';

class Colors_Rebrickable extends Colors_Base {
    
    static async getColors():Promise<Color[]> {

        const r = rebrick.init('4343cb915f7b16c5626ac8f545b2f5ec');

        const request = await r.lego.getColors();

        let colorArray = request.results.map((colorData: {
            id: number;
            rgb: tinycolor.ColorInput | undefined;
            external_ids: { LEGO: { ext_ids: any[]; }; };
            name: string;
            is_trans: boolean;
        }) => {
            if(colorData.id < 0) {
                return false;
            }

            const color = tinycolor(colorData.rgb);

            const legoId = colorData?.external_ids?.LEGO?.ext_ids[0];

            if(legoId === undefined) {
                return false;
            }

            const cases = {
                camel: camelCase(colorData.name),
                constant: constantCase(colorData.name),
                snake: snakeCase(colorData.name),
                id: legoId,
                slug: snakeCase(colorData.name).toLocaleLowerCase().split('_').join('-')
            };


            const data = {
                id: cases.id,
                name: colorData.name,
                slug: cases.slug,
                type: colorData?.is_trans === true ? 'Transparent' : 'Solid',
                // isTransparent: colorData?.is_trans === true ? true : false,
                keys: cases,
                hex: color.toHexString(),
                rgb: { ...color.toRgb() },
                externalIds: {
                    ...colorData?.external_ids,
                    Rebrickable: {ext_ids: [colorData.id]}
                }
            };

            return data;
        });

        colorArray = colorArray.filter((color: boolean|Color) => color !== false);
        
        return colorArray;
    }
}

export default Colors_Rebrickable;