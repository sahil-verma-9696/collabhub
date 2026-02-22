/**
 * Password Validation Utility
 * Handles password validation and strength checking
 */

/**
 * Validate strong password requirements
 */
export function validate(password) {
  const errors = [];

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (password && password.length > 128) {
    errors.push("Password must be no more than 128 characters");
  }

  if (!/[A-Z]/.test(password || "")) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password || "")) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password || "")) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*]/.test(password || "")) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*)",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Simple password validation
 */
export function validateSimple(password) {
  const errors = [];

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (password && password.length > 128) {
    errors.push("Password must be no more than 128 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate strength score (0–100)
 */
export function getStrengthScore(password) {
  let score = 0;

  if (!password) return score;

  // Length points
  if (password.length >= 6) score += 20;
  if (password.length >= 10) score += 20;
  if (password.length >= 16) score += 20;

  // Complexity points
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[!@#$%^&*]/.test(password)) score += 10;

  return Math.min(score, 100);
}

/**
 * Get strength label
 */
export function getStrengthLabel(password) {
  const score = getStrengthScore(password);

  if (score < 20) return "Very Weak";
  if (score < 40) return "Weak";
  if (score < 60) return "Fair";
  if (score < 80) return "Good";
  return "Strong";
}
