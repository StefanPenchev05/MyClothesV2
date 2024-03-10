import { Temp } from "../models/Temp.js";

/**
 *
 * @param {string} key
 * @param {any} value
 * @param {number} expiryInSec
 * 
 * @returns {Promise<void>}
 */

export default async function setTempMemory(key, value, expiryInSec) {
  return new Promise((resolve, reject) => {
    const expiresAt = new Date(Date.now() + expiryInSec * 1000);
    console.log(expiresAt);
    const newTemp = new Temp({ key, value, expiresAt });
    newTemp
      .save()
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}
