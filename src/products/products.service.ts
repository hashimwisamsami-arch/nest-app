import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { UpdateProductDto } from './dtos/update-product.dto.js';
type ProductType = { id: number; title: string; price: number };
export class ProductsService {
  private products: ProductType[] = [
    { id: 1, title: 'book', price: 10 },
    { id: 2, title: 'pen', price: 2 },
    { id: 3, title: 'bag', price: 25 },
  ];

  /**
   * Get All products
   */
  public getAll() {
    return this.products;
  }

  /**
   * Get Product By id
   */
  public getOneBy(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }

  /**
   * Create New product
   */
  public craeteProduct({ title, price }: CreateProductDto) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title,
      price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * Update product
   */
  public update(
    id: number,

    updateProductDto: UpdateProductDto,
  ) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return { message: 'Product Updated successfully', updateProductDto };
  }

  /**
   * Delete product
   */
  public delete(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return { message: 'Product Deleted successfully with id:' + id };
  }
}
