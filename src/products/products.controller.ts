import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { UpdateProductDto } from './dtos/update-product.dto.js';
type ProductType = { id: number; title: string; price: number };

@Controller('api/products')
export class ProductsController {
  private products: ProductType[] = [
    { id: 1, title: 'book', price: 10 },
    { id: 2, title: 'pen', price: 2 },
    { id: 3, title: 'bag', price: 25 },
  ];
  // GET: ~/api/products
  @Get()
  public getAllProducts() {
    return this.products;
  }

  // GET: ~/api/products/:id
  @Get(':id')
  public getProductById(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }

  // Post: ~/api/products
  @Post()
  public craeteNewProduct(@Body() body: CreateProductDto) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title: body.title,
      price: body.price,
    };
    this.products.push(newProduct);
    return newProduct;
  }
  // Put: ~/api/products/:id
  @Put(':id')
  public updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) {
      throw new NotFoundException('product not found');
    }
    console.log(body);
    return { message: 'Product Updated successfully with id:' + id };
  }

  @Delete(':id')
  public deleteProduct(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return { message: 'Product Deleted successfully with id:' + id };
  }
}
