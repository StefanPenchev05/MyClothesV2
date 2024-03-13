import { Temp } from "../models/Temp.js";

/**
 * Sets a temporary memory in the database.
 * @param {string} key - The key of the memory.
 * @param {any} value - The value of the memory.
 * @param {number} expiryInSec - The expiry time of the memory in seconds.
 * @returns {Promise} - A promise that resolves when the memory has been set.
 */
export default async function setTempMemory(key, value, expiryInSec) {
  return new Promise((resolve, reject) => {
    // Calculate the expiry date
    const expiresAt = new Date(Date.now() + expiryInSec * 1000);

    // Create a new Temp object
    const newTemp = new Temp({ key, value, expiresAt });

    // Save the Temp object to the database
    newTemp
      .save()
      .then(() => resolve()) // If the save operation was successful, resolve the promise
      .catch((err) => reject(err)); // If an error occurred, reject the promise with the error
  });
}