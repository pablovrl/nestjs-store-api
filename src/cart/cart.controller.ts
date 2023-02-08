import { Controller, Get, Put } from '@nestjs/common';

@Controller('cart')
export class CartController {
  @Get()
  getCart() {
    return 'This method will return the user cart';
  }

  @Put()
  updateCart() {
    return 'This method will update the user cart';
  }
}
