import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '@prisma/client';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let prisma: PrismaService;

  const productsArray: Product[] = [
    {
      id: 1,
      title: 'product 1',
      description: 'description 1',
      price: 1,
      updatedAt: new Date(),
      createdAt: new Date(),
      image: 'image 1',
    },
    {
      id: 2,
      title: 'product 2',
      description: 'description 2',
      price: 2000,
      updatedAt: new Date(),
      createdAt: new Date(),
      image: 'image 2',
    },
  ];

  const oneProduct = productsArray[0];

  const db = {
    product: {
      findMany: jest.fn().mockResolvedValue(productsArray),
      findUnique: jest.fn().mockResolvedValue(oneProduct),
      create: jest.fn().mockResolvedValue(oneProduct),
      update: jest.fn().mockResolvedValue(oneProduct),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    productsService = module.get(ProductsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of products', async () => {
      const products = productsService.getAll();

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(products).resolves.toEqual(productsArray);
    });
  });

  describe('getOne', () => {
    it('should return one product', async () => {
      const product = productsService.getOne(1);

      expect(prisma.product.findUnique).toHaveBeenCalled();
      expect(product).resolves.toEqual(oneProduct);
    });

    it('should throw an error if product not found', async () => {
      const spy = jest
        .spyOn(prisma.product, 'findUnique')
        .mockResolvedValue(null);

      const product = productsService.getOne(-1);

      expect(spy).toHaveBeenCalled();
      expect(product).rejects.toThrowError(NotFoundException);
    });
  });

  describe('insertOne', () => {
    it('should insert one product', async () => {
      const product = productsService.insertOne(oneProduct);

      expect(prisma.product.create).toHaveBeenCalled();
      expect(product).resolves.toEqual(oneProduct);
    });
  });

  describe('updateOne', () => {
    it('should update one product', async () => {
      const product = productsService.updateOne(1, oneProduct);

      expect(prisma.product.update).toHaveBeenCalled();
      expect(product).resolves.toEqual(oneProduct);
    });

    it('should throw an error if product not found', async () => {
      const spy = jest
        .spyOn(prisma.product, 'update')
        .mockRejectedValue({ code: 'P2025' });

      const product = productsService.updateOne(-1, oneProduct);

      expect(spy).toHaveBeenCalled();
      expect(product).rejects.toThrowError(NotFoundException);
    });
  });
});
