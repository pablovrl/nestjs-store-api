import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateUpdateCategoryDto } from './dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.getAll();
  }

  @Post()
  create(@Body() dto: CreateUpdateCategoryDto) {
    return this.categoriesService.insertOne(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateUpdateCategoryDto,
  ) {
    return this.categoriesService.updateOne(id, dto);
  }
}
