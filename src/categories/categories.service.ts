import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany();
  }

  create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  async update(id: number, dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: {
          id,
        },
        data: dto,
      });
    } catch (e) {
      if (e.code === 'P2025') throw new NotFoundException('Category not found');
      throw e;
    }
  }
}
