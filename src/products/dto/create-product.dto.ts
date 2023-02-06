import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string;
}
