import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemDocument, Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { MulterS3 } from 'multer-s3';

@Injectable()
export class ItemsService {
    constructor(
        @InjectModel('Item') private readonly itemModel: Model<ItemDocument>,
    ) {}

    // Common function to validate the item ID format
    private validateItemId(itemId: string): void {
        if (!itemId || !itemId.match(/^[0-9a-fA-F]{24}$/)) {
            throw new BadRequestException(`Invalid item ID format for '${itemId}'.`);
        }
    }

    // Create a new item
    async createItem(createItemDto: CreateItemDto, files: Array<MulterS3.File>): Promise<Item> {
        try {
            const imageUrls = files.map(file => file.location);
            const newItemData = { ...createItemDto, images: imageUrls };

            const newItem = new this.itemModel(newItemData);
            const createdItem = await newItem.save();

            return createdItem;
        } catch (error) {
            console.error('Error creating item:', error);
            throw new BadRequestException('Failed to create item');
        }
    }

    // Get all items
    async getAllItems(): Promise<Item[]> {
        return await this.itemModel.find().exec();
    }

    // Get item by ID
    async getItemsById(itemId: string): Promise<Item> {
        this.validateItemId(itemId);
        const item = await this.itemModel.findById(itemId).exec();

        if (!item) {
            throw new NotFoundException(`Item with ID ${itemId} not found`);
        }

        return item;
    }

    // Check if item with a given name exists
    async getItemByName(name: string): Promise<boolean> {
        const item = await this.itemModel.findOne({ name }).exec();
        return !!item;
    }

    // Update item by ID
    async updateItem(id: string, updateItemDto: UpdateItemDto, files: Array<MulterS3.File>): Promise<Item> {
        this.validateItemId(id);
        const imageUrls = files.map(file => file.location);
        const updateItemData = { ...updateItemDto, images: imageUrls };

        const updatedItem = await this.itemModel.findByIdAndUpdate(
            id,
            updateItemData,
            { new: true } // Return the updated item
        );

        if (!updatedItem) {
            throw new NotFoundException(`Item with ID ${id} not found`);
        }

        return updatedItem; // Return the updated item
    }
}
