import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsEmailAllowed } from '@dtos/decorators';

export class CreateUserDto {
  @IsEmail()
  @IsEmailAllowed({
    message: 'Email is not allowed',
  })
  public email: string;

  @IsString()
  public password: string;
}

export class UpdateUserDto {
  @IsOptional()
  public name: string;

  @IsOptional()
  public avatar: string;

  @IsOptional()
  public preferences: {};

  @IsOptional()
  public password: string;
}

export class UserRefreshTokenDto {
  @IsEmail()
  @IsEmailAllowed({
    message: 'Email is not allowed',
  })
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public refreshToken: string;
}
