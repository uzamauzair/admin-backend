import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

    async createCategory(name: string): Promise<Category> {
        const createdCategory = new this.categoryModel({ name });
        return createdCategory.save();
    }

    async getCategoryByName(name: string): Promise<Category | null> {
        const category = await this.categoryModel.findOne({ name }).exec();
        return category;
    }

    async findAllCategories(): Promise<Category[]> {
        return await this.categoryModel.find().exec();
    }

    async getCategoryById(categoryId: string) {
        const category = await this.categoryModel.findOne({ _id: categoryId }).exec();
        console.log("Cat", category);

        if (!category) {
            throw new NotFoundException(`Category with id '${categoryId}' not exist.`);
        }
        return category;
    }

    async updateCategory(categoryId: string, newName: string): Promise<Category | null> {
        const updatedCategory = await this.categoryModel.findByIdAndUpdate(
            categoryId,
            { name: newName },
            { new: true }
        );
        return updatedCategory;
    }

    async deleteCategory(categoryId: string) {
        return await this.categoryModel.deleteOne({ categoryId })
    }

}
