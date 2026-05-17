import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  userId!: string;

  @IsString()
  productId!: string;

  @IsNumber()
  @IsPositive()
  unitPrice!: number;

  @IsNumber()
  @IsPositive()
  quantity!: number;
}

