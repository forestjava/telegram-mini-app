import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создать новый ресурс
   */
  async create(createResourceDto: CreateResourceDto) {
    return this.prisma.resource.create({
      data: createResourceDto,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  /**
   * Получить дерево ресурсов (корневые с вложенными)
   */
  async findTree() {
    return this.buildTreeRecursively(null);
  }

  /**
   * Рекурсивно строит дерево ресурсов
   */
  private async buildTreeRecursively(parentId: number | null) {
    const resources = await this.prisma.resource.findMany({
      where: { parentId },
      orderBy: { id: 'asc' },
    });

    return Promise.all(
      resources.map(async (resource) => ({
        ...resource,
        children: await this.buildTreeRecursively(resource.id),
      })),
    );
  }

  /**
   * Получить ресурс по ID (с дочерними)
   */
  async findOne(id: number) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        parent: true,
      },
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID "${id}" not found`);
    }

    const children = await this.buildTreeRecursively(id);

    return {
      ...resource,
      children,
    };
  }

  /**
   * Обновить ресурс
   */
  async update(id: number, updateResourceDto: UpdateResourceDto) {
    // Проверяем существование ресурса
    const existing = await this.prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Resource with ID "${id}" not found`);
    }

    return this.prisma.resource.update({
      where: { id },
      data: updateResourceDto,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  /**
   * Удалить ресурс вместе со всеми дочерними
   */
  async remove(id: number) {
    // Проверяем существование ресурса
    const existing = await this.prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Resource with ID "${id}" not found`);
    }

    // Рекурсивно удаляем все дочерние ресурсы
    await this.deleteChildrenRecursively(id);

    // Удаляем сам ресурс
    return this.prisma.resource.delete({
      where: { id },
    });
  }

  /**
   * Рекурсивное удаление дочерних ресурсов
   */
  private async deleteChildrenRecursively(parentId: number) {
    const children = await this.prisma.resource.findMany({
      where: { parentId },
      select: { id: true },
    });

    for (const child of children) {
      await this.deleteChildrenRecursively(child.id);
      await this.prisma.resource.delete({
        where: { id: child.id },
      });
    }
  }
}
