import type { AuthProvider, User } from '@prisma/client';

export class UserResponseDto {
  id: number;
  type: AuthProvider;
  telegramId: string | null;  // BigInt сериализуется в string для JSON
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
    telegramId: user.telegramId?.toString() ?? null,
    keycloakId: user.keycloakId,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    photoUrl: user.photoUrl,
  };
}
