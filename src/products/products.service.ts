import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { UpdateProductDto } from './dtos/update-product.dto.js';
import { Repository } from 'typeorm';
import { Product } from './product.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Get All products
   * @returns collection of products
   */
  public async getAll() {
    return await this.productsRepository.find();
  }

  /**
   * Get Product By id
   * @param id id of product
   * @returns return product from DB
   */
  public async getOneBy(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }

  /**
   * Create New product
   * @param dto data for create new product
   * @param userId id of the logged in user (Admin)
   * @returns the craeted product from the database
   */
  public async craeteProduct(dto: CreateProductDto, userId: number) {
    const user = await this.usersService.getCurrentUser(userId);
    const newProduct = this.productsRepository.create({
      ...dto,
      title: dto.title.toLowerCase(),
      user,
    });
    return await this.productsRepository.save(newProduct);
  }

  /**
   * Update product
   * @param id  id of product
   * @param dto data for updating product
   * @returns updated product
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
   * @param id id of product
   * @returns success message
   */
  public async delete(id: number) {
    const product = await this.getOneBy(id);
    await this.productsRepository.remove(product);
    return { message: 'Product Deleted' };
  }
}
