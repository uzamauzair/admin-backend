import { Controller, Get, Post, Put, Body, Param, NotFoundException, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    // Create a new category
    @Post()
    @HttpCode(HttpStatus.CREATED) // Set HTTP status code to 201 (Created) for successful creation
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        const { name } = createCategoryDto;
        const categoryExist = await this.categoriesService.getCategoryByName(name);

        if (categoryExist) {
            throw new NotFoundException(`Category with name '${name}' already exists.`);
        }
        return await this.categoriesService.createCategory(createCategoryDto);
    }

    // Get all categories
    @Get()
    @HttpCode(HttpStatus.OK) // Set HTTP status code to 200 (OK) for successful retrieval
    async findAllCategories() {
        console.log("Log", process.env.AUTH0_ISSUER_URL);
        console.log("Log2", process.env.AUTH0_AUDIENCE);

        return await this.categoriesService.findAllCategories();
    }

    // Get a category by ID
    @Get(':id')
    @HttpCode(HttpStatus.OK) // Set HTTP status code to 200 (OK) for successful retrieval
    async getCategory(@Param('id') id: string) {
        return await this.categoriesService.getCategoryById(id);
    }

    // Update a category by ID
    @Put(':id')
    @HttpCode(HttpStatus.OK) // Set HTTP status code to 200 (OK) for successful update
    async updateCategory(@Param('id') id: string, @Body() updateCategory: UpdateCategoryDto) {
        const { name } = updateCategory;
        const categoryExist = await this.categoriesService.getCategoryByName(name);

        if (categoryExist) {
            throw new NotFoundException(`Category with name '${name}' already exists.`);
        }
        const updatedCategory = await this.categoriesService.updateCategory(id, updateCategory);

        return updatedCategory
    }

    // Delete a category by ID
    @Delete(':id')
    @HttpCode(HttpStatus.OK) // Set HTTP status code to 200 (OK) for successful deletion
    async deleteCategory(@Param('id') id: string) {
        await this.categoriesService.deleteCategory(id);
        return { message: `Category with ID '${id}' has been deleted successfully.` };
    }
}
