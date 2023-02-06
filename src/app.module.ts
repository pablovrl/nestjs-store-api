import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [ProductsModule, PrismaModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
