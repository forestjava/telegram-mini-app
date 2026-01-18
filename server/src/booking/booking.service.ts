import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toUserResponse } from '../auth/dto/user-response.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Забронировать ресурс
   * @param resourceId - ID ресурса для бронирования
   * @param userId - ID пользователя (уже существует в БД после AuthGuard)
   */
  async createBooking(resourceId: string, userId: string) {
    // Проверяем существование ресурса
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID "${resourceId}" not found`);
    }

    // Проверяем, не забронирован ли уже ресурс
    const existingBooking = await this.prisma.booking.findUnique({
      where: { resourceId },
    });

    if (existingBooking) {
      throw new ConflictException(
        `Resource with ID "${resourceId}" is already booked`,
      );
    }

    // Создаём бронь (пользователь уже создан/обновлён в AuthGuard)
    return this.prisma.booking.create({
      data: {
        resourceId,
        userId,
      },
      include: {
        resource: true,
        user: true,
      },
    });
  }

  /**
   * Снять бронь с ресурса
   */
  async removeBooking(resourceId: string) {
    // Проверяем существование брони
    const booking = await this.prisma.booking.findUnique({
      where: { resourceId },
    });

    if (!booking) {
      throw new NotFoundException(
        `No booking found for resource with ID "${resourceId}"`,
      );
    }

    // Удаляем бронь
    return this.prisma.booking.delete({
      where: { resourceId },
      include: {
        resource: true,
        user: true,
      },
    });
  }

  /**
   * Получить дерево ресурсов с информацией о бронировании
   */
  async findResourcesWithBookings() {
    return this.buildTreeWithBookings(null);
  }

  /**
   * Рекурсивно строит дерево ресурсов с информацией о бронировании
   */
  private async buildTreeWithBookings(parentId: string | null) {
    const resources = await this.prisma.resource.findMany({
      where: { parentId },
      include: {
        booking: {
          include: {
            user: true,
          },
        },
      },
    });

    return Promise.all(
      resources.map(async (resource) => {
        const { booking, ...rest } = resource;

        const result: any = {
          ...rest,
          children: await this.buildTreeWithBookings(resource.id),
        };

        // Добавляем booking только если он существует
        if (booking) {
          result.booking = {
            user: toUserResponse(booking.user),
          };
        }

        return result;
      }),
    );
  }
}
