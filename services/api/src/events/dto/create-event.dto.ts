import { IsString, IsDateString, IsOptional, IsNumber, IsUUID, IsObject } from 'class-validator';

export class CreateEventDto {
  @IsUUID()
  orgId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  sdgGoal?: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  @IsOptional()
  endAt?: string;

  @IsObject()
  @IsOptional()
  location?: any;

  @IsNumber()
  @IsOptional()
  capacity?: number;
}
