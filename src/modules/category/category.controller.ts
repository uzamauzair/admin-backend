import { Controller, Get, Post, Put, Body, Param, NotFoundException, Delete } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        const { name } = createCategoryDto;
        const categoryExist = await this.categoriesService.getCategoryByName(name);
        console.log("CE", categoryExist);

        if (categoryExist) {
            throw new NotFoundException(`Category with name '${name}' already exist.`);
        }
        return await this.categoriesService.createCategory(name);
    }

    @Get()
    async findAllCategories() {
        return await this.categoriesService.findAllCategories();
    }

    @Get(':id')
    async getCategory(@Param('id') id: string) {
        console.log("Id", id);
        return await this.categoriesService.getCategoryById(id)
    }

    @Put(':id')
    async updateCategory(@Param('id') id: string, @Body('name') newName: string) {
        return await this.categoriesService.updateCategory(id, newName);
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id: string) {
        return await this.categoriesService.deleteCategory(id)
    }
}
