import crypto from "crypto";

// Generates a random token to pass back to frontend
export const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};
