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

    describe('isEmail', () => {
        it('should resolve the promise when the email is valid', () => {
            expect(Validator.isEmail('test01@gmail.com')).resolves.toBe(true);
        });

        it('should reject the promise when the email is missing', () => {
            expect(Validator.isEmail('')).rejects.toBe(false);
        });

        it('should reject the promise when the email do not pass the RegEx expression', () => {
            expect(Validator.isEmail('invalid.email')).rejects.toBe(false);
        });

        it('should reject the promise when the email do not pass the RegEx expression', () => {
            expect(Validator.isEmail('inv.alid@email')).rejects.toBe(false);
        });

        it('should reject the promise when the email do not pass the RegEx expression', () => {
            expect(Validator.isEmail('test@test.')).rejects.toBe(false);
        });

        it('should reject the promise when the email does not have a valid domain', () => {
            expect(Validator.isEmail('test@test.test')).rejects.toBe(false);
        });
    });
});