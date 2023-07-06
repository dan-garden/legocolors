import ColorProviders from "./ColorProviders.js";

const uc = new ColorProviders();
uc.buildColorJSON().then(() => {
    const colors = ColorProviders.buildColorKeys(uc.colors);
    ColorProviders.writeFile(colors);
    console.log("Colors updated");
});
