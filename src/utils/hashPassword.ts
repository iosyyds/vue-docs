import { createHash } from 'crypto';

export const hashPassword = (password: string): string => {
  return createHash('sha256').update(String(password)).digest('hex');
};
