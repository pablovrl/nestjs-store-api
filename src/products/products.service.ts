import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
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
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: dto,
    });
  }
}
