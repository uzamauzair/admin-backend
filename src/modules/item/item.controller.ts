import { Controller, Post, Body, HttpStatus, HttpCode, BadRequestException, UseInterceptors, UploadedFiles, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MulterS3 } from 'multer-s3';
import { ItemsService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { S3FileInterceptor } from 'src/common/interceptors/s3-file.interceptor';
import { NestInterceptor } from '@nestjs/common';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    // POST /items - Create a new item
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(createS3FileInterceptor('images')) // Apply S3FileInterceptor to handle image uploads
    async createItem(
        @Body() createItemDto: CreateItemDto,
        @UploadedFiles() files: Array<MulterS3.File>
    ) {
        try {
            // Check if files are uploaded
            if (!files || !files.length) {
                throw new BadRequestException('No image uploaded'); // Handle missing image
            }

            const parsedVariants = JSON.parse(createItemDto.variants.toString())
            createItemDto.variants = parsedVariants
            const newItem = await this.itemsService.createItem(createItemDto, files);
            return { message: 'Item created successfully', item: newItem };
        } catch (error) {
            throw new BadRequestException('Failed to create item');
        }
    }

    // GET /items - Get all items
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllItems() {
        return await this.itemsService.getAllItems();
    }

    // GET /items/:id - Get item by ID
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getItemById(@Param('id') id: string) {
        return await this.itemsService.getItemsById(id);
    }

    // PUT /items/:id - Update item by ID
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(createS3FileInterceptor('images'))
    async updateItem(
        @Param('id') id: string,
        @Body() updateItem: UpdateItemDto,
        @UploadedFiles() files: Array<MulterS3.File>
    ) {
        try {
            // Check if files are uploaded
            if (!files || !files.length) {
                throw new BadRequestException('No Image uploaded');
            }
            const updatedItem = await this.itemsService.updateItem(id, updateItem, files);
            return { message: 'Item updated successfully', item: updatedItem }; // Return the updated item
        } catch (error) {
            throw new BadRequestException('Failed to update item');
        }
    }

    // Delete /items/:id - Delete item by ID
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async getDefaultAutoSelectFamilyAttemptTimeout(
        @Param('id') id: string
    ) {
        await this.itemsService.deleteItem(id)
        return { message: `Item with ID '${id}' has been deleted successfully.` };
    }

}

// Factory function to create S3FileInterceptor instance
function createS3FileInterceptor(fieldName: string): NestInterceptor {
    return new S3FileInterceptor(fieldName);
}
