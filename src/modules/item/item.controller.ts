import { Controller, Post, Body, HttpStatus, HttpCode, BadRequestException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { MulterS3 } from 'multer-s3';
import { ItemsService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { S3FileInterceptor } from 'src/common/interceptors/s3-file.interceptor';  // Custom interceptor for handling S3 file uploads
import { NestInterceptor } from '@nestjs/common';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(createS3FileInterceptor('images')) // Apply S3FileInterceptor to handle image uploads
    async createItem(@Body() createItemDto: CreateItemDto, @UploadedFiles() files: Array<MulterS3.File>) {

        try {
            if (!files || !files.length) {
                throw new BadRequestException('No image uploaded'); // Handle missing image
            }
            const newItem = await this.itemsService.createItem(createItemDto, files);
            return { message: 'Item created successfully', item: newItem };
        } catch (error) {
            throw new BadRequestException('Failed to create item');
        }
    }
}

// Factory function to create S3FileInterceptor instance
function createS3FileInterceptor(fieldName: string): NestInterceptor {
    return new S3FileInterceptor(fieldName);
}
