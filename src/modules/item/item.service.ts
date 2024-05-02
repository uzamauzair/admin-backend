import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemDocument, Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { S3 } from 'aws-sdk';
import { MulterS3 } from 'multer-s3';

@Injectable()
export class ItemsService {
    constructor(
        @InjectModel('Item') private readonly itemModel: Model<ItemDocument>,
        @Inject(S3) private readonly s3: S3, // Inject AWS S3 service
    ) {}

    async createItem(createItemDto: CreateItemDto, files: Array<MulterS3.File>): Promise<Item> {
        try {
            // Extract image URLs from all uploaded files
            const imageUrls = files.map(file => file.location);

            // Create new item with image URLs
            const newItemData = { ...createItemDto, images: imageUrls };
            console.log('New item data:', newItemData); // Log newItemData for debugging

            const newItem = new this.itemModel(newItemData);

            // Save the item to the database
            const createdItem = await newItem.save();
            console.log('Item created successfully:', createdItem); // Log createdItem for debugging

            return createdItem;
        } catch (error) {
            console.error('Error creating item:', error);
            throw new BadRequestException('Failed to create item');
        }
    }
}
