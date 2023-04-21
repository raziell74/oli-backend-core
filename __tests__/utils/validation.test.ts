// __tests__/utils/validation.test.ts
import { isValidEmail } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    test('should return true for valid email addresses', () => {
      const validEmails = [
        'john.doe@example.com',
        'jane_doe@example.co.uk',
        'test+123@example.org',
      ];

      validEmails.forEach((email) => {
        console.log(email, 'isValid', isValidEmail(email) ? 'true' : 'false');
        expect(isValidEmail(email)).toBe(true);
      });
    });

    test('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'john.doe@example',
        'john.doe@.com',
        'john.doe@example..com',
        'john.doe@.com.',
      ];

      invalidEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });
});
