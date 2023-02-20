import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let prisma: PrismaService;

  const testCategoryName1 = 'category 1';

  const categoriesArray: Category[] = [
    {
      id: 1,
      name: testCategoryName1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'category 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const oneCategory = categoriesArray[0];

  const db = {
    category: {
      findMany: jest.fn().mockResolvedValue(categoriesArray),
      create: jest.fn().mockResolvedValue(oneCategory),
      update: jest.fn().mockResolvedValue(oneCategory),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    categoriesService = module.get(CategoriesService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of categories', async () => {
      const categories = categoriesService.getAll();

      expect(prisma.category.findMany).toBeCalledTimes(1);
      expect(categories).resolves.toEqual(categoriesArray);
    });
  });

  describe('insertOne', () => {
    it('should create a category and return it', () => {
      const newCategory = categoriesService.insertOne({
        name: testCategoryName1,
      });

      expect(prisma.category.create).toBeCalledTimes(1);
      expect(newCategory).resolves.toEqual(oneCategory);
    });
  });

  describe('updateOne', () => {
    it('should call the update method', () => {
      const updatedCategory = categoriesService.updateOne(1, {
        name: testCategoryName1,
      });

      expect(prisma.category.update).toBeCalledTimes(1);
      expect(updatedCategory).resolves.toBe(oneCategory);
    });

    it('should return an error when the category does not exist', () => {
      const spy = jest.spyOn(prisma.category, 'update').mockRejectedValueOnce({
        code: 'P2025',
      });

      expect(spy).toBeCalledTimes(1);
      expect(categoriesService.updateOne(-1, { name: 'test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
