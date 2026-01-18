import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TelegramAuthService } from './services/telegram-auth.service';
import { KeycloakAuthService } from './services/keycloak-auth.service';
import { AuthGuard } from './guards/auth.guard';

@Module({
  controllers: [AuthController],
  providers: [TelegramAuthService, KeycloakAuthService, AuthGuard],
  exports: [TelegramAuthService, KeycloakAuthService, AuthGuard],
})
export class AuthModule {}
