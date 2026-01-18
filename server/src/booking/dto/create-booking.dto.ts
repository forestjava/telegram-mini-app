import { IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  resourceId: string;
}
