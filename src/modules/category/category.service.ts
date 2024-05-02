import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

    // Common function to validate the category ID format
    private validateCategoryId(categoryId: string): void {
        if (!isValidObjectId(categoryId)) {
            throw new BadRequestException(`Invalid category ID format for '${categoryId}'.`);
        }
    }

    // Create a new category
    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const createdCategory = new this.categoryModel(createCategoryDto);
        return createdCategory.save();
    }

    // Check if a category with the given name exists
    async getCategoryByName(name: string): Promise<boolean> {
        const category = await this.categoryModel.findOne({ name }).exec();
        return !!category; // Returns true if category exists, false otherwise
    }

    // Get all categories
    async findAllCategories(): Promise<Category[]> {
        return await this.categoryModel.find().exec();
    }

    // Get a category by ID
    async getCategoryById(categoryId: string): Promise<Category> {
        this.validateCategoryId(categoryId); // Validate the category ID format

        const category = await this.categoryModel.findById(categoryId).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID '${categoryId}' does not exist.`);
        }
        return category;
    }

    // Update a category by ID
    async updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        this.validateCategoryId(categoryId); // Validate the category ID format

        const updatedCategory = await this.categoryModel.findByIdAndUpdate(
            categoryId,
            updateCategoryDto,
            { new: true }
        );
        if (!updatedCategory) {
            throw new NotFoundException(`Category with ID '${categoryId}' not found.`);
        }
        return updatedCategory;
    }

    // Delete a category by ID
    async deleteCategory(categoryId: string): Promise<void> {
        this.validateCategoryId(categoryId); // Validate the category ID format

        const deletedCategory = await this.categoryModel.findByIdAndDelete(categoryId).exec();
        if (!deletedCategory) {
            throw new NotFoundException(`Category with ID '${categoryId}' not found.`);
        }
    }
}
