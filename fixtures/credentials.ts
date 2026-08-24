/**
 * Centralized test credentials, loaded from environment variables.
 * Copy .env.example to .env and fill in real values before running the suite.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env and fill in real values.`);
  }
  return value;
}

export const STANDARD_USERNAME = requireEnv('SAUCE_USERNAME');
export const STANDARD_PASSWORD = requireEnv('SAUCE_PASSWORD');
export const LOCKED_OUT_USERNAME = requireEnv('SAUCE_LOCKED_USER');
