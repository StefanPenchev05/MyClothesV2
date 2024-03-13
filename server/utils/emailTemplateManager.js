import fs, { promises } from "fs";
import ejs from "ejs";
import path from "path";
import juice from "juice";
import postcss from 'postcss';
import { dirname } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";

/**
 * Function to convert Tailwind CSS in HTML into regular CSS using PostCSS.
 * @param {string} tailwindConfig - The path to the HTML file with Tailwind CSS.
 * @param {Object} tailwindSourcePath - The Tailwind CSS configuration object.
 * @returns {Promise<string>} The processed CSS.
 */
async function convertTailWindIntoCss(tailwindConfig, tailwindSourcePath){

    // Read the Tailwind CSS source file
    const tailwindSource = await promises.readFile(tailwindSourcePath, 'utf-8');

    // Create a PostCSS processor with Tailwind CSS
    // The processor will use the provided Tailwind CSS configuration
    const processor = postcss([tailwindcss(tailwindConfig)]);

    // Process the HTML with the PostCSS processor
    // The processor will convert the Tailwind CSS in the HTML into regular CSS
    const result = await processor.process(tailwindSource, { from: undefined });

    // Return the processed CSS
    // This CSS can now be used in your application
    return result.css
}

/**
 * Load and convert an HTML template.
 * @param {string} templateName - The name of the template to load. This should be the name of an HTML file in the emailTemplates directory, without the .html extension.
 * @param {Object} data - The data to insert into the template. This should be an object where the keys are the names of placeholders in the template and the values are the values to replace the placeholders with.
 * @returns {Promise<string>} The converted HTML template.
*/

export function generateTemplate(templateName, data){
    return new Promise((resolve, reject) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        // Define the paths for the template and its settings
        const templatePath = path.resolve(__dirname, `../emailTemplates/${templateName}/${templateName}.ejs`);
        const settingsPath =  path.resolve(__dirname, `../emailTemplates/${templateName}/settings.json`);

        // Read settings.json
        fs.readFile(settingsPath, 'utf-8', (err, settings) => {
            if(err){
                // If an error occurred while reading the file, reject the promise
                reject(err);
                return;
            }

            // Parse the settings from JSON to a JavaScript object
            const settingsJSON = JSON.parse(settings);
            // Get the style compilator from the settings
            const styleCompilator = settingsJSON.styleCompilator;

            // Render the template with the provided data
            ejs.renderFile(templatePath, data, {}, async(err, str) => {
                if(err){
                    // If an error occurred while rendering the template, reject the promise
                    reject(err);
                }else{
                    // If the style compilator is Tailwind CSS, apply Tailwind CSS styles
                    if(styleCompilator === 'tailwind'){
                        const tailwindConfig = path.resolve(__dirname, `../emailTemplates/styles/tailwind.config.js`);
                        const tailwindSourcePath = path.resolve(__dirname, '../emailTemplates/styles/main.css');
                        const css = await convertTailWindIntoCss(tailwindConfig, tailwindSourcePath);
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