import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoriesService } from '../category.service';

@ValidatorConstraint({ name: 'IsNameUnique', async: true })
@Injectable()
export class IsNameUnique implements ValidatorConstraintInterface {
    constructor(private readonly categoriesService: CategoriesService) {}

    async validate(name: string, args: ValidationArguments) {
        const existingCategory = await this.categoriesService.getCategoryByName(name);

        if (existingCategory) {
            throw new BadRequestException(`${args.property} '${name}' already exists.`);
        }

        return true; // Validation passed
    }


    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be unique.`;
    }
}
