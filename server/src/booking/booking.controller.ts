import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type User } from '@prisma/client';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * POST /bookings
   * Забронировать ресурс
   * Требует авторизации через X-Auth header
   */
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: User) {
    return this.bookingService.createBooking(createBookingDto.resourceId, user.id);
  }

  /**
   * DELETE /bookings/:resourceId
   * Снять бронь с ресурса
   * Требует авторизации через X-Auth header
   */
  @Delete(':resourceId')
  @UseGuards(AuthGuard)
  remove(@Param('resourceId') resourceId: string) {
    return this.bookingService.removeBooking(resourceId);
  }

  /**
   * GET /bookings/resources
   * Получить дерево ресурсов с информацией о бронировании
   */
  @Get('resources')
  findResourcesWithBookings() {
    return this.bookingService.findResourcesWithBookings();
  }
}
