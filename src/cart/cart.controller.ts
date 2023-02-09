import { Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
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
