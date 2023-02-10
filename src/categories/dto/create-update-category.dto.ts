import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
