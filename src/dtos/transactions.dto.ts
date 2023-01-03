import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  public userId: number;

  @IsNumber()
  public walletId: number;

  @IsNumber()
  public blockchainId: number;

  @IsObject()
  public tx: {};

  @IsString()
  public pin: string;
}

export class UpdateTransactionDto {
  @IsNumber()
  public txId: number;

  @IsObject()
  public tx: {};

  @IsOptional()
  @IsString()
  public txState;

  @IsOptional()
  @IsString()
  public gasEstimate;

  @IsString()
  public pin: string;
}
