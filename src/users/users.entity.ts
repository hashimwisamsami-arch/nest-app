import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';
import { CURRENT_TIMESTAMP } from '../utils/constants.js';
import { Product } from '../products/product.entity.js';
import { Review } from '../reviews/review.entity.js';
import { UserType } from '../utils/enum.js';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '150', nullable: true })
  username: string;

  @Column({ type: 'varchar', length: '250', unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
  userType: UserType;

  @Column({ default: false })
  isAccountVerified: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.user)
  products: Relation<Product>[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Relation<Review>[];
}
