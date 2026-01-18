import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TelegramAuthService } from './services/telegram-auth.service';
import { KeycloakAuthService } from './services/keycloak-auth.service';

@Module({
  controllers: [AuthController],
  providers: [TelegramAuthService, KeycloakAuthService],
  exports: [TelegramAuthService, KeycloakAuthService],
})
export class AuthModule {}
