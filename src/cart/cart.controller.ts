import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CartService } from './cart.service';
import { AddDeleteProductFromCartDto } from './dto';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtGuard)
export class CartController {
  constructor(private cartService: CartService) {}
  @Get()
  getCart(@GetUser('id') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Put()
  addToCart(
    @GetUser('id') userId: number,
    @Body() dto: AddDeleteProductFromCartDto,
  ) {
    return this.cartService.addToCart(userId, dto);
  }

  @Delete()
  deleteFromCart(
    @GetUser('id') userId: number,
    @Body() dto: AddDeleteProductFromCartDto,
  ) {
    return this.cartService.deleteFromCart(userId, dto);
  }
}
