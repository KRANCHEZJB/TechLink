import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateRegistrationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  eventId: string;

  @IsString()
  @IsOptional()
  status?: string;
}
