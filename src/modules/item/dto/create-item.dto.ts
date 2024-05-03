import { IsNotEmpty, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { VariantDto } from './variant-item.dto';


export class CreateItemDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsUrl({}, { each: true })
    images: string[];

    @IsNotEmpty()
    @IsString()
    categoryId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => VariantDto)
    variants: VariantDto[];
}
