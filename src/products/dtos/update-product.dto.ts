import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @ApiPropertyOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiPropertyOptional()
  @IsOptional()
  price?: number;
}
