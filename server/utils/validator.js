import dns from "dns";
import { Temp } from "../models/Temp.js";

export class Validator {
  /**
   * Checks if the given first and last are valid
   *
   * @param {string} first
   * @param {string} last
   *
   * @returns {boolean}
   */
  static isFirstAndLastName(first, last) {
    if (first === undefined || first.length === 0) {
      return "First Name is required";
    } else if (last === undefined || last.length === 0) {
      return "Last Name is required";
    }
    const name = first + last;

    // Check if name only contains alphabetic characters
    if (!/^[a-zA-Z]+$/.test(name)) {
      return "Name can only contain alphabetic characters";
    }

    return true;
  }
  /**
   * Checks if the given value is valid email
   *
   * @param {string} value - This value to check
   * @returns {Promise<boolean | string>} True if the value is a valid email address, false otherwise.
   */
  static async isEmail(value) {
    return new Promise((resolve, reject) => {
      // Reject the promise if the value is not provided
      if (!value) {
        reject("Email is not valid");
      }

      // Regular expression for email validation
      const regEx =
        /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x09\x0b\x0c\x0e-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;

      // Reject the promise if the value is not a valid email
      if (!regEx.test(value)) {
        reject("Email is not valid");
      }

      // Extract the domain from the email
      const domain = value.split("@")[1];

      // Check if the domain has DNS records
      dns.lookup(domain, async (err) => {
        if (err) {
          reject("Email is not valid");
        } else {
          const userExists = await Temp.exists({ "value.email": value });
          if (userExists) {
            reject("That email is temporarily taken");
          }

          resolve(true);
        }
      });
    });
  }

  /**
   * Checks the if the value is valid username
   *
   * @param {string} value
   * @returns {Promise<boolean | string>}
   */
  static isUsername(value) {
    if (value && value.length > 0) {
      return /^[a-zA-Z0-9_\-]*$/.test(value);
    }
      return ("Username is not valid");
  }

  /**
   * This function validates a password based on several criteria
   *
   * @param {string} value
   * @returns {boolean | string}
   */
  static async isPassword(value) {
    if (!value.trim()) {
      return "Password is required";
    }

    // Define the validation criteria
    const validations = [
      {
        test: (password) => password.length >= 8,
        error: "Password must be at least 8 characters long.",
      },
      {
        test: (password) => /[A-Z]/.test(password),
        error: "Password must contain at least one uppercase letter.",
      },
      {
        test: (password) => /[a-z]/.test(password),
        error: "Password must contain at least one lowercase letter.",
      },
      {
        test: (password) => /[0-9]/.test(password),
        error: "Password must contain at least one number.",
      },
      {
        test: (password) =>
          /[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\:\'\"\<\>\,\.\?\/\~\`]/.test(
            password
          ),
        error: "Password must contain at least one special character.",
      },
      {
        test: (password) => !/(\w)\1\1/.test(password),
        error:
          "Password must not contain three repeating characters in a row (e.g., 'aaa' not allowed).",
      },
    ];

    // Check each validation criteria
    for (let i = 0; i < validations.length; i++) {
      if (!validations[i].test(value.trim())) {
        return validations[i].error;
      }
    }

    return true;
  }
}
