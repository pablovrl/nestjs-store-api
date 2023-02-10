import { IsInt, IsNotEmpty } from 'class-validator';

export class AddProductDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
