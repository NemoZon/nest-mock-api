import { compare, hash } from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = 10;

function getSaltRounds(): number {
  const value = Number(process.env.PASSWORD_SALT_ROUNDS ?? DEFAULT_SALT_ROUNDS);

  if (!Number.isInteger(value) || value < 4 || value > 31) {
    return DEFAULT_SALT_ROUNDS;
  }

  return value;
}

export function hashPassword(password: string): Promise<string> {
  return hash(password, getSaltRounds());
}

export function verifyPassword(
  rawPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(rawPassword, hashedPassword);
}
