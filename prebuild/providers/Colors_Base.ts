import { Color } from '../../src/main.js';

class Colors_Base {
    static async getColors(): Promise<Color[]> {
        return new Promise(async (resolve) => {
            resolve([]);
        });
    }

    static extractParenthesis(str: string): {
        extracted: string;
        replaced: string;
    } {
        const regex = /\((.*?)\)/g;
        const match = regex.exec(str);
        const extracted = match ? match[1] : "";

        return {
            extracted,
            // replaced: str,
            replaced: str.replace(regex, "").trim()
        }
    }
}

export default Colors_Base;