import dns from "dns";
import { resolve } from "path";

export class Validator {
  /**
   * Checks if the given value is valid email
   *
   * @param {string} value - This value to check
   * @returns {Promise<boolean>} True if the value is a valid email address, false otherwise.
   */
  static async isEmail(value) {
    return new Promise((resolve, reject) => {
      // Reject the promise if the value is not provided
      if (!value) {
        reject(false);
      }

      // Regular expression for email validation
      const regEx =
        /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x09\x0b\x0c\x0e-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;

      // Reject the promise if the value is not a valid email
      if (!regEx.test(value)) {
        reject(false);
      }

      // Extract the domain from the email
      const domain = value.split("@")[1];

      // Check if the domain has DNS records
      dns.lookup(domain, (err) => {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
