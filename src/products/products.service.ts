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
      include: {
        categories: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        image: dto.image,
        categories: dto.categories && {
          createMany: {
            data: dto.categories.map((id) => ({ categoryId: id })),
          },
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          price: dto.price,
          image: dto.image,
          categories: dto.categories && {
            deleteMany: {},
            createMany: {
              data: dto.categories.map((id) => ({ categoryId: id })),
            },
          },
        },
        include: {
          categories: true,
        },
      });

      return product;
    } catch (e) {
      if (e.code === 'P2025') throw new NotFoundException('Product not found');
      throw e;
    }
  }
}
