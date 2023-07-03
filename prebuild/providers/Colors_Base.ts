import fs from 'fs';
import { Color } from '../../src/main.js';

class Colors_Base {
    static async getColors(): Promise<Color[]> {
        return new Promise(async (resolve) => {
            resolve([]);
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
            fs.writeFile('src/colors.json', JSON.stringify(colors), 'utf8', () => {
                resolve();
            });
        });
    }
}

export default Colors_Base;