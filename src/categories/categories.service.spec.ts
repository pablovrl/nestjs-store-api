import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { CreateUpdateCategoryDto } from './dto';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let prismaService: PrismaService;

  const categories: Category[] = [
    {
      id: 1,
      name: 'Category 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Category 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockPrisma = {
    category: {
      findMany: () => Promise.resolve(categories),
      create: (obj: { data: CreateUpdateCategoryDto }) =>
        Promise.resolve(obj.data),
      update: (obj: { where: { id: number }; data: CreateUpdateCategoryDto }) =>
        Promise.resolve(obj.data),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    categoriesService = module.get(CategoriesService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all the categories', async () => {
      const allCategories = await categoriesService.findAll();
      expect(allCategories).toBe(categories);
    });
  });

  describe('create', () => {
    it('should create a category and return it', () => {
      const payload: CreateUpdateCategoryDto = { name: 'new category' };
      const newCategory = categoriesService.create(payload);

      expect(newCategory).resolves.toBe(payload);
    });
  });

  describe('update', () => {
    it('should update a category and return it', () => {
      const payload: CreateUpdateCategoryDto = { name: 'updated category' };
      const updatedCategory = categoriesService.update(1, payload);

      expect(updatedCategory).resolves.toBe(payload);
    });
  });
});
