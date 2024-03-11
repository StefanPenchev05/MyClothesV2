import { Validator } from '../../utils/validator';

describe('Validator', () => {
    describe('isFirstAndLastName', () => {
        it('should return true for valid firt and last names', () => {
            expect(Validator.isFirstAndLastName('Stefan', 'Penchev')).toBe(true);
        })

       it('should return error message when the first name is missing', () => {
        expect(Validator.isFirstAndLastName('', 'Penchev')).toBe("First Name is required");
       });

       it('should return error message when the last name is missing', () => {
        expect(Validator.isFirstAndLastName('Stefan', '')).toBe("Last Name is required")
       });

       it('should return error message when in any of the names contains other symbols rather than letters', () => {
        expect(Validator.isFirstAndLastName('Stefan2', 'Penchev#')).toBe("Name can only contain alphabetic characters")
       });

       it('should return error message when in any of the names contains other symbols rather than letters', () => {
        expect(Validator.isFirstAndLastName('Stefan', '3')).toBe("Name can only contain alphabetic characters")
       });
    });

    describe('isUsername', () => {
        it('should return true when the username is valid', () => {
            expect(Validator.isUsername('valid_username')).toBe(true);
        });

        it('should return false when the username is invalid', () => {
            expect(Validator.isUsername('invalid username')).toBe(false);
        });

        it('should return false when the username is missing', () => {
            expect(Validator.isUsername('')).toBe("Username is not valid");
        });
    });

    describe('isEmail', () => {
        it('should resolve the promise when the email is valid', () => {
            expect(Validator.isEmail('test01@gmail.com')).resolves.toBe(true);
        });

        it('should reject the promise when the email is missing', () => {
            expect(Validator.isEmail('')).rejects.toBe("Email is not valid");
        });
    
        it('should reject the promise when the email do not pass the RegEx expression', () => {
            expect(Validator.isEmail('invalid.email')).rejects.toBe("Email is not valid");
        });
    
        it('should reject the promise when the email do not pass the RegEx expression', () => {
            expect(Validator.isEmail('inv.alid@email')).rejects.toBe("Email is not valid");
        });
    
        it('should reject the promise when the email do not pass the RegEx expression', () => {
            expect(Validator.isEmail('test@test.')).rejects.toBe("Email is not valid");
        });
    
        it('should reject the promise when the email does not have a valid domain', () => {
            expect(Validator.isEmail('test@test.test')).rejects.toBe("Email is not valid");
        });
    });

    describe('isPassword', () => {
        it('should return true when the password is valid', async () => {
            expect(await Validator.isPassword('ValidPassword1!')).toBe(true);
        });

        it('should return an error when the password is too short', async () => {
            expect(await Validator.isPassword('Short1!')).toBe('Password must be at least 8 characters long.');
        });

        it('should return an error when the password does not contain an uppercase letter', async () => {
            expect(await Validator.isPassword('lowercase1!')).toBe('Password must contain at least one uppercase letter.');
        });

        it('should return an error when the password does not contain a lowercase letter', async () => {
            expect(await Validator.isPassword('UPPERCASE1!')).toBe('Password must contain at least one lowercase letter.');
        });

        it('should return an error when the password does not contain a number', async () => {
            expect(await Validator.isPassword('NoNumber!')).toBe('Password must contain at least one number.');
        });

        it('should return an error when the password does not contain a special character', async () => {
            expect(await Validator.isPassword('NoSpecialChar1')).toBe('Password must contain at least one special character.');
        });

        it('should return an error when the password contains three repeating characters', async () => {
            expect(await Validator.isPassword('aaaValid1!')).toBe('Password must not contain three repeating characters in a row (e.g., \'aaa\' not allowed).');
        });
    });
});