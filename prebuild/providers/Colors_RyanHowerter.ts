import Colors_Base from "./Colors_Base.js";
import tinycolor from 'tinycolor2';
import {
    camelCase,
    constantCase,
    snakeCase
} from 'change-case';
import axios from "axios";
import Cheerio from "cheerio";
import { Color } from '../../src/main.js';

class Colors_RyanHowerter extends Colors_Base {
    static async getColors():Promise<Color[]> {
        const url = 'https://ryanhowerter.net/colors.php';

        return new Promise(async (resolve) => {
            axios.get(url).then(response => {
                const $ = Cheerio.load(response.data);
                const colorArray: Color[] | PromiseLike<Color[]> = [];

                $('#maintable tbody tr').each((_, row) => {
                    const $row = $(row);
                    const $cells = $row.find('>td');
                    
                    const name = $cells.eq(4).text().trim();
                    const colorHex = $cells.eq(13).text().trim();
                    
                    if(!name || !colorHex) return;
                    
                    const color = tinycolor(colorHex);

                    const cases = {
                        camel: camelCase(name),
                        constant: constantCase(name),
                        snake: snakeCase(name),
                        id: parseInt($cells.eq(1).text().trim()),
                        slug: snakeCase(name).toLocaleLowerCase().split('_').join('-')
                    };

                    const type = $cells.eq(0).text().trim();

                    const bricklinkId = parseInt($cells.eq(3).text().trim());

                    const data = {
                        id: cases.id,
                        name: name,
                        slug: cases.slug,
                        type: type,
                        keys: cases,
                        hex: color.toHexString(),
                        rgb: { ...color.toRgb() },
                        externalIds: {
                            BrickLink: {
                                ext_ids: [bricklinkId]
                            },
                        }
                    };

                    colorArray.push(data);
                });

                resolve(colorArray);
            });
        });
    }
}

export default Colors_RyanHowerter;