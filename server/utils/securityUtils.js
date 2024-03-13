import CryptoJS from "crypto-js";

/**
 * Encrypt a string using AES encryption.
 * @param {string} text - The text to encrypt. This could be any string that you want to encrypt, such as a user ID.
 * @param {string} secretKey - The secret key for encryption. This should be a string that you use as the key for AES encryption. If no key is provided, the function will use the ENCRYPTION_SECRET environment variable as the key.
 * @returns {string} The encrypted text. This is the original text after it has been encrypted using AES encryption.
 */
export function encrypt(text, secretKey = process.env.ENCRYPTION_SECRET) {
    // Use the AES encryption method from the CryptoJS library to encrypt the text
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

/**
 * Decrypt a string using AES decryption.
 * @param {string} text - A string to decrypt. This is expected to be a string that was previously encrypted using AES encryption.
 * @param {string} secretKey - The secret key for decryption. This is expected to be a string that was used as the key during AES encryption. If no key is provided, the function will use the ENCRYPTION_SECRET environment variable as the key.
 * @returns {string} - The decrypted userId. This is the original userId before it was encrypted.
 */
export function decrypt(text, secretKey = process.env.ENCRYPTION_SECRET){
    // Use the AES decryption method from the CryptoJS library to decrypt the userId
    const bytes = CryptoJS.AES.decrypt(text, secretKey);
    // Convert the decrypted bytes back into a string and return it
    return bytes.toString(CryptoJS.enc.Utf8);
}