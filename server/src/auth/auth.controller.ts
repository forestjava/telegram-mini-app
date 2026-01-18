import {
  Controller,
  Get,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { TelegramAuthService } from './services/telegram-auth.service';
import { KeycloakAuthService } from './services/keycloak-auth.service';
import { AuthData } from './dto/auth-data.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly telegramAuthService: TelegramAuthService,
    private readonly keycloakAuthService: KeycloakAuthService,
  ) {}

  @Get('me')
  getMe(@Headers('X-Auth') authHeader: string): Record<string, unknown> {
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
      throw new BadRequestException('Invalid X-Auth header: missing type or signature');
    }

    switch (authData.type) {
      case 'Telegram':
        return this.telegramAuthService.validate(authData.signature);

      case 'Keycloak':
        return this.keycloakAuthService.validate(authData.signature);

      default:
        throw new BadRequestException(`Unknown auth type: ${authData.type}`);
    }
  }
}
