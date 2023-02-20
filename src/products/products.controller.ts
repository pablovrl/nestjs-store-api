import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { Roles } from 'src/auth/decorator';
import { JwtGuard, RoleGuard } from 'src/auth/guard';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.getAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.getOne(id);
  }

  @Roles('ADMIN')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.insertOne(dto);
  }

  @Roles('ADMIN')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateOne(id, dto);
  }
}
