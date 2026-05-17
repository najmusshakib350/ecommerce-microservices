import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  userId!: string;

  @IsString()
  productId!: string;

  @IsNumber()
  @IsPositive()
  quantity!: number;
}
