import type { AuthProvider } from '@prisma/client';

export type AuthData = {
  type: AuthProvider;
  signature: string;
};
