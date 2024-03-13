import fs from "fs"
import ejs from "ejs"
import path from "path"
import juice from "juice"
import tailwindcss from "tailwindcss"

/**
 * Load and convert an HTML template.
 * @param {string} templateName - The name of the template to load. This should be the name of an HTML file in the emailTemplates directory, without the .html extension.
 * @param {Object} data - The data to insert into the template. This should be an object where the keys are the names of placeholders in the template and the values are the values to replace the placeholders with.
 * @returns {Promise<string>} The converted HTML template.
 */
export function convertTemplate(templateName, data){
    return new Promise((resolve, reject) => {
        // Define the paths for the template and its settings
        const templatePath = path.resolve(__dirname, `../emailTemplates/${templateName}/${templateName}.html`);
        const settingsPath =  path.resolve(__dirname, `../emailTemplates/${templateName}/settings.json`);

        // Read settings.json
        fs.readFile(settingsPath, 'utf-8', (err, settings) => {
            if(err){
                // If an error occurred while reading the file, reject the promise
                reject(err);
                return;
            }

            // Parse the settings from JSON to a JavaScript object
            const settings = JSON.parse(settings);
            // Get the style compilator from the settings
            const styleCompilator = settings.styleCompilator;

            // Render the template with the provided data
            ejs.renderFile(templatePath, data, {}, (err, str) => {
                if(err){
                    // If an error occurred while rendering the template, reject the promise
                    reject(err);
                }else{
                    // If the style compilator is Tailwind CSS, apply Tailwind CSS styles
                    if(styleCompilator === 'tailwind'){
                        const css = tailwindcss(path.resolve(__dirname, "../emailTemplates/style/tailwind.config.js"));
                        const inlineHtml = juice.inlineContent(str,css);
                        resolve(inlineHtml);
                    }else{
                        // Otherwise, apply the styles from the style.css file in the template's directory
                        const css = path.resolve(__dirname, `../emailTemplates/${templateName}/style.css`);
                        const inlineHtml = juice.inlineContent(str,css);
                        resolve(inlineHtml);
                    }
                }
            });
        })
    })
}