import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity.js';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service.js';
import { UsersService } from '../users/users.service.js';
import { CreateReviewDto } from './dtos/create-review.dto.js';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly productService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create New review
   * @param productId id of product
   * @param userId id of user that craete the review
   * @param dto data for craeting new review
   * @returns the craeted review from the DB
   */
  public async createReview(
    productId: number,
    userId: number,
    dto: CreateReviewDto,
  ) {
    const product = await this.productService.getOneBy(productId);
    const user = await this.usersService.getCurrentUser(userId);

    const review = this.reviewsRepository.create({ ...dto, user, product });
    const result = await this.reviewsRepository.save(review);
    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      craetedAt: result.createdAt,
      updatedAt: result.updatedAt,
      userId: user.id,
      productId: product.id,
    };
  }
}
