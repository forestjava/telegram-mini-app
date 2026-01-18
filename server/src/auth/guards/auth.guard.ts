import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
  NotImplementedException,
} from '@nestjs/common';
import { TelegramAuthService } from '../services/telegram-auth.service';
import { KeycloakAuthService } from '../services/keycloak-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthData } from '../dto/auth-data.dto';
import { type User, AuthProvider } from '@prisma/client';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface KeycloakUser {
  sub: string; // Keycloak user ID (UUID)
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly telegramAuthService: TelegramAuthService,
    private readonly keycloakAuthService: KeycloakAuthService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['x-auth'];

    if (!authHeader) {
      throw new BadRequestException('Missing X-Auth header');
    }

    let authData: AuthData;
    try {
      authData = JSON.parse(authHeader);
    } catch {
      throw new BadRequestException('Invalid X-Auth header: not a valid JSON');
    }

    if (!authData.type || !authData.signature) {
      throw new BadRequestException(
        'Invalid X-Auth header: missing type or signature',
      );
    }

    let user: User;

    switch (authData.type) {
      case 'Telegram':
        user = await this.handleTelegramAuth(authData.signature);
        break;

      case 'Keycloak':
        user = await this.handleKeycloakAuth(authData.signature);
        break;

      default:
        throw new BadRequestException(`Unknown auth type: ${authData.type}`);
    }

    // Прикрепляем пользователя к request
    request.user = user;

    return true;
  }

  /**
   * Обработка Telegram авторизации
   */
  private async handleTelegramAuth(signature: string): Promise<User> {
    const validatedData = this.telegramAuthService.validate(signature);
    const telegramUser = validatedData.user as TelegramUser | undefined;

    if (!telegramUser || typeof telegramUser.id !== 'number') {
      throw new UnauthorizedException('User data not found in auth payload');
    }

    return this.prisma.user.upsert({
      where: { telegramId: telegramUser.id },
      create: {
        type: AuthProvider.Telegram,
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        photoUrl: telegramUser.photo_url,
      },
      update: {
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        photoUrl: telegramUser.photo_url,
      },
    });
  }

  /**
   * Обработка Keycloak авторизации
   */
  private async handleKeycloakAuth(signature: string): Promise<User> {
    const validatedData = this.keycloakAuthService.validate(signature);
    throw new NotImplementedException('Keycloak authentication is not implemented yet');
  }
}
