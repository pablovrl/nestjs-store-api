import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUpdateCategoryDto } from './dto/create-update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany();
  }

  create(dto: CreateUpdateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  async update(id: number, dto: CreateUpdateCategoryDto) {
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
