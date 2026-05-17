import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductWithImageDto {
  @IsString()
  title!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  price!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  stock!: number;
}
