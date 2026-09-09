import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;
}
