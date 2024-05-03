import { IsNotEmpty, IsNumber, IsString, IsUrl, Min, ValidateNested } from 'class-validator';

export class VariantDto {
    @IsNotEmpty()
    @IsString()
    size: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    quantity: number;
}
