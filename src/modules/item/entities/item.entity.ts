import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true, validate: /\S+\.\S+/ }) // Custom validator for URL format
    images: string[];

    @Prop([
        {
            size: String,
            price: Number,
            quantity: Number,
        },
    ])
    variants: Array<{ size: string; price: number; quantity: number }>;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    categoryId: mongoose.Schema.Types.ObjectId; // Assuming Category model has been defined
}

export const ItemSchema = SchemaFactory.createForClass(Item);
