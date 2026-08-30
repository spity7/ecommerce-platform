export type PasswordStrengthLabel = "Weak" | "Medium" | "Strong";

export const STRONG_PASSWORD_MIN_LENGTH = 8;

export const STRONG_PASSWORD_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special symbol.";

export function isStrongPassword(value: string): boolean {
  if (value.length < STRONG_PASSWORD_MIN_LENGTH) {
    return false;
  }
  if (!/[A-Z]/.test(value)) {
    return false;
  }
  if (!/[a-z]/.test(value)) {
    return false;
  }
  if (!/[0-9]/.test(value)) {
    return false;
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    return false;
  }
  return true;
}

export function getPasswordStrengthScore(value: string): number {
  let score = 0;
  if (value.length >= STRONG_PASSWORD_MIN_LENGTH) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

export function getPasswordStrengthLabel(value: string): PasswordStrengthLabel {
  const score = getPasswordStrengthScore(value);
  if (score <= 1) {
    return "Weak";
  }
  if (score <= 3) {
    return "Medium";
  }
  return "Strong";
}

export function getMissingPasswordRequirements(value: string): string[] {
  const missing: string[] = [];
  if (value.length < STRONG_PASSWORD_MIN_LENGTH) {
    missing.push("8+ characters");
  }
  if (!/[A-Z]/.test(value)) {
    missing.push("an uppercase letter");
  }
  if (!/[a-z]/.test(value)) {
    missing.push("a lowercase letter");
  }
  if (!/[0-9]/.test(value)) {
    missing.push("a number");
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    missing.push("a special symbol");
  }
  return missing;
}

interface PasswordValidationOptions {
  requireStrong?: boolean;
}

export function getPasswordValidationError(
  password: string,
  confirmPassword: string,
  options: PasswordValidationOptions = {}
): string | null {
  const { requireStrong = true } = options;
  const label = getPasswordStrengthLabel(password);

  if (password.length > 0 && password.length < STRONG_PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${STRONG_PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > 0 && requireStrong && label !== "Strong") {
    return "Password must be Strong to continue.";
  }
  if (confirmPassword.length > 0 && password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return null;
}
