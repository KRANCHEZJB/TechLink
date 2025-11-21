import { IsEmail, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  role?: string;
}
