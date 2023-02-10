import { Module } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService, ProductsService],
})
export class CartModule {}
