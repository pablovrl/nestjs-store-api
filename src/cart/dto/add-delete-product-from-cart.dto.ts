import { IsInt, IsNotEmpty } from 'class-validator';

export class AddDeleteProductFromCartDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
