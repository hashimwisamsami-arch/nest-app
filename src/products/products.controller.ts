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
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { UpdateProductDto } from './dtos/update-product.dto.js';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET: ~/api/products
  @Get()
  public getAllProducts() {
    return this.productsService.getAll();
  }

  // GET: ~/api/products/:id
  @Get(':id')
  public getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneBy(id);
  }

  // Post: ~/api/products
  @Post()
  public craeteNewProduct(
    @Body()
    body: CreateProductDto,
  ) {
    return this.productsService.craeteProduct(body);
  }
  // Put: ~/api/products/:id
  @Put(':id')
  public updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  public deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
