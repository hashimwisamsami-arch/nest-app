import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity.js';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service.js';
import { UsersService } from '../users/users.service.js';
import { CreateReviewDto } from './dtos/create-review.dto.js';
import { UpdateReviewDto } from './dtos/update-review.dto.js';
import { JWTPayloadType } from '../utils/types.js';
import { UserType } from '../utils/enum.js';

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
  /**
   * Get All Reviews
   * @returns collection of reviews from DB
   */
  public async getAll() {
    return await this.reviewsRepository.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * Get Review By id
   * @param id id of review
   * @returns return review from DB
   */
  public async getOneBy(id: number) {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('review not found');
    }
    return review;
  }

  /**
   * Update review
   * @param id id of review
   * @param userId id of user who own this review
   * @param dto data for updating the review
   * @returns update review
   */
  public async update(id: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.getOneBy(id);
    if (review.user.id !== userId) {
      throw new ForbiddenException('access denied,you are not allowed');
    }
    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;
    return this.reviewsRepository.save(review);
  }

  /**
   * Delete Review From DB
   * @param id id of Review
   * @param payload JWTPayload
   * @returns suceess message
   */
  public async delete(id: number, payload: JWTPayloadType) {
    const review = await this.getOneBy(id);
    if (review.user.id === payload.id || payload.userType === UserType.ADMIN) {
      await this.reviewsRepository.remove(review);
      return { message: 'Review Deleted' };
    }
    throw new ForbiddenException('access denied,you are not allowed');
  }
}
