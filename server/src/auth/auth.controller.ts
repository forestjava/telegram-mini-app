import { Controller, Get, UseGuards } from '@nestjs/common';
import { type User } from '@prisma/client';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserResponseDto, toUserResponse } from './dto/user-response.dto';

@Controller()
export class AuthController {
  /**
   * GET /me
   * Получить данные текущего авторизованного пользователя
   * Требует авторизации через X-Auth header
   */
  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: User): UserResponseDto {
    return toUserResponse(user);
  }
}
