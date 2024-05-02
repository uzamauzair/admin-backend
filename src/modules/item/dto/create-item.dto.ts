import { IsNotEmpty, IsNumber, IsString, IsUrl, Min } from 'class-validator';

export class CreateItemDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    price: number;

    @IsNotEmpty()
    @IsUrl({}, { each: true })
    images: string[];

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    quantity: number;

    @IsNotEmpty()
    @IsString()
    categoryId: string;
}
