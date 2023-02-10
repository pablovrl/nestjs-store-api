import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsOnCarts } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { AddProductDto } from './dto';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductsService,
  ) {}

  async getCart(userId: number) {
    return await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        products: true,
      },
    });
  }

  async addToCart(userId: number, dto: AddProductDto) {
    const cart = await this.checkIfProductExistsInCart(userId, dto.productId);

    if (cart) {
      return await this.prisma.cart.update({
        where: {
          userId,
        },
        data: {
          products: {
            update: {
              where: {
                productId_cartId: {
                  cartId: cart.id,
                  productId: dto.productId,
                },
              },
              data: {
                quantity: {
                  increment: dto.quantity,
                },
              },
            },
          },
        },
        include: {
          products: true,
        },
      });
    }

    await this.productService.findOne(dto.productId);

    return await this.prisma.cart.update({
      where: {
        userId,
      },
      data: {
        products: {
          create: {
            productId: dto.productId,
            quantity: dto.quantity,
          },
        },
      },
      include: {
        products: true,
      },
    });
  }

  async deleteFromCart(userId: number, dto: AddProductDto) {
    const cart = await this.checkIfProductExistsInCart(userId, dto.productId);

    if (!cart) {
      throw new NotFoundException('Product not found in cart');
    }

    const productQuantity = await this.getProductQuantity(
      dto.productId,
      cart.products,
    );

    if (dto.quantity > productQuantity) {
      throw new BadRequestException(
        'Product quantity is less than the quantity you want to delete',
      );
    }

    if (dto.quantity === productQuantity)
      return await this.prisma.cart.update({
        where: {
          userId,
        },
        data: {
          products: {
            delete: {
              productId_cartId: {
                cartId: cart.id,
                productId: dto.productId,
              },
            },
          },
        },
        include: {
          products: true,
        },
      });

    return await this.prisma.cart.update({
      where: {
        userId,
      },
      data: {
        products: {
          update: {
            where: {
              productId_cartId: {
                cartId: cart.id,
                productId: dto.productId,
              },
            },
            data: {
              quantity: {
                decrement: dto.quantity,
              },
            },
          },
        },
      },
      include: {
        products: true,
      },
    });
  }

  async checkIfProductExistsInCart(userId: number, productId: number) {
    return await this.prisma.cart.findFirst({
      where: {
        userId,
        products: {
          some: {
            productId,
          },
        },
      },
      include: {
        products: true,
      },
    });
  }

  async getProductQuantity(productId: number, products: ProductsOnCarts[]) {
    return products.find((p) => p.productId === productId).quantity;
  }
}
