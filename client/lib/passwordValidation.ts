import type { PasswordStrengthLabel } from "@platform/shared";
import {
  getPasswordStrengthLabel,
  getPasswordValidationError as getSharedPasswordValidationError,
  getMissingPasswordRequirements,
} from "@platform/shared";

export type { PasswordStrengthLabel };

export interface PasswordStrengthResult {
  label: PasswordStrengthLabel;
  color: string;
  progress: number;
}

const STRENGTH_COLORS: Record<PasswordStrengthLabel, string> = {
  Weak: "#dc3545",
  Medium: "#ff9800",
  Strong: "#198754",
};

const STRENGTH_PROGRESS: Record<PasswordStrengthLabel, number> = {
  Weak: 33,
  Medium: 66,
  Strong: 100,
};

export function getPasswordStrength(value: string): PasswordStrengthResult {
  const label = getPasswordStrengthLabel(value);
  return {
    label,
    color: STRENGTH_COLORS[label],
    progress: STRENGTH_PROGRESS[label],
  };
}

interface PasswordErrorOptions {
  requireStrong?: boolean;
}

export function getPasswordValidationError(
  password: string,
  confirmPassword: string,
  options: PasswordErrorOptions = {}
): string | null {
  return getSharedPasswordValidationError(password, confirmPassword, options);
}

export { getMissingPasswordRequirements };
