import { IsInt } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  resourceId: number;
}
