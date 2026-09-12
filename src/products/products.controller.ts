import { ProductsService } from './products.service.js';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { UpdateProductDto } from './dtos/update-product.dto.js';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard.js';
import { Roles } from '../users/decorators/user-role.decorator.js';
import { UserType } from '../utils/enum.js';
import { CurrentUser } from '../users/decorators/current-user.decorator.js';
import type { JWTPayloadType } from '../utils/types.js';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET: ~/api/products
  @Get()
  public getAllProducts(
    @Query('title') title: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    return this.productsService.getAll(title, minPrice, maxPrice);
  }

  // GET: ~/api/products/:id
  @Get(':id')
  public getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneBy(id);
  }

  // Post: ~/api/products
  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public craeteNewProduct(
    @Body()
    body: CreateProductDto,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.productsService.craeteProduct(body, payload.id);
  }
  // Put: ~/api/products/:id
  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
