import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { UpdateProductDto } from './dtos/update-product.dto.js';
import { Repository } from 'typeorm';
import { Product } from './product.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  /**
   * Get All products
   */
  public async getAll() {
    return await this.productsRepository.find();
  }

  /**
   * Get Product By id
   */
  public async getOneBy(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }

  /**
   * Create New product
   */
  public async craeteProduct(dto: CreateProductDto) {
    const newProduct = this.productsRepository.create(dto);
    return await this.productsRepository.save(newProduct);
  }

  /**
   * Update product
   */
  public async update(
    id: number,

    dto: UpdateProductDto,
  ) {
    const product = await this.getOneBy(id);
    product.title = dto.title ?? product.title;
    product.description = dto.description ?? product.description;
    product.price = dto.price ?? product.price;
    return this.productsRepository.save(product);
  }

  /**
   * Delete product
   */
  public async delete(id: number) {
    const product = await this.getOneBy(id);
    await this.productsRepository.remove(product);
    return { message: 'Product Deleted' };
  }
}
