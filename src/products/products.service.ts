import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProductDto } from './dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        categories: true,
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: dto,
      });

      return product;
    } catch (e) {
      if (e.code === 'P2025') throw new NotFoundException('Product not found');
      throw e;
    }
  }
}
