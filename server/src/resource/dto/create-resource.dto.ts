import { Prisma } from '@prisma/client';

export class CreateResourceDto {
  title: string;
  parentId?: number;
  metadata?: Prisma.InputJsonValue;
}
