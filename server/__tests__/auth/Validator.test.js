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
});