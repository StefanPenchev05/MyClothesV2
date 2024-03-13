import ejs from "ejs"
import path from "path"
import juice from "juice"
import tailwindcss from "tailwindcss"

/**
 * Load and convert an HTML template.
 * @param {string} templateName - The name of the template to load. This should be the name of an HTML file in the emailTemplates directory, without the .html extension.
 * @param {Object} data - The data to insert into the template. This should be an object where the keys are the names of placeholders in the template and the values are the values to replace the placeholders with.
 * @param {Boolean} useTailwindcss - Indicates whether the template uses Tailwind CSS for styling. If true, the function will apply Tailwind CSS styles to the template. If false, it will apply vanila css styles.
 * @returns {Promise<string>} The converted HTML template.
 */

export function convertTemplate(templateName, data, useTailwindcss = true){
    return new Promise((resolve, reject) => {
        const templatePath = path.resolve(__dirname, `../emailTemplates/${templateName}.html`);
        ejs.renderFile(templatePath, data, {}, (err, str) => {
            if(err){
                reject(err);
            }else{
                if(useTailwindcss){
                    // Apply Tailwind CSS styles
                    const css = tailwindcss(path.resolve(__dirname, "../emailTemplates/style/tailwind.config.js"));
                    const inlineHtml = juice.inlineContent(str,css);
                    resolve(inlineHtml);
                }else{
                    const css = path.resolve(__dirname, `../emailTemplates/${templateName}/style.css`);
                    const inlineHtml = juice.inlineContent(str,css);
                    resolve(inlineHtml);
                }
            }
        });
    })
}