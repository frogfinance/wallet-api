import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  public pin: string;

  @IsNumber()
  public userId: number;

  @IsNumber()
  public blockchainId: number;
}

export class UpdateWalletDto {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  public pin: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  public newPin: string;
}
