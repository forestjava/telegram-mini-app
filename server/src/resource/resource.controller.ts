import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  /**
   * POST /resources
   * Создать новый ресурс
   */
  @Post()
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourceService.create(createResourceDto);
  }

  /**
   * GET /resources
   * Получить иерархическую структуру ресурсов
   */
  @Get()
  findAll() {
    return this.resourceService.findTree();
  }

  /**
   * GET /resources/:id
   * Получить ресурс по ID (с дочерними)
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resourceService.findOne(id);
  }

  /**
   * PATCH /resources/:id
   * Обновить ресурс
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourceService.update(id, updateResourceDto);
  }

  /**
   * DELETE /resources/:id
   * Удалить ресурс вместе с дочерними
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.resourceService.remove(id);
  }
}
