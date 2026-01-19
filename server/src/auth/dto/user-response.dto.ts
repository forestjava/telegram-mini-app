import type { AuthProvider, User } from '@prisma/client';

export class UserResponseDto {
  id: number;
  type: AuthProvider;
  telegramId?: bigint | null;
  keycloakId: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
}

/**
 * Трансформирует модель User из Prisma в единообразный DTO для ответа API
 */
export function toUserResponse(user: User): UserResponseDto {
  return {
    id: user.id,
    type: user.type,
    telegramId: user.telegramId,
    keycloakId: user.keycloakId,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    photoUrl: user.photoUrl,
  };
}
