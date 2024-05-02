import { IsNotEmpty, IsString, Validate } from "class-validator"
import { IsNameUnique } from "../validators/category.validator";

export class UpdateCategoryDto {

    @IsString()
    @IsNotEmpty()
    @Validate(IsNameUnique)
    name: string;

    @IsString()
    description: string
}

