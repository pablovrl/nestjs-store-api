import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsOptional()
  categories?: number[];
}
