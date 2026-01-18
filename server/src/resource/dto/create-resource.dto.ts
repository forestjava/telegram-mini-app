import { Prisma } from '@prisma/client';

export class CreateResourceDto {
  title: string;
  parentId?: string;
  metadata?: Prisma.InputJsonValue;
}
