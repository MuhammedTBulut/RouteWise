import { PasswordValidation } from '../types/auth';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const validatePassword = (password: string): PasswordValidation => {
  return {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    maxLength: password.length <= PASSWORD_MAX_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

export const isPasswordValid = (validation: PasswordValidation): boolean => {
  return Object.values(validation).every((v) => v === true);
};

export const getPasswordStrength = (validation: PasswordValidation): {
  strength: 'weak' | 'medium' | 'strong';
  percentage: number;
} => {
  const validCount = Object.values(validation).filter((v) => v).length;
  const totalChecks = Object.keys(validation).length;
  const percentage = (validCount / totalChecks) * 100;

  let strength: 'weak' | 'medium' | 'strong';
  if (percentage < 50) {
    strength = 'weak';
  } else if (percentage < 100) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return { strength, percentage };
};
