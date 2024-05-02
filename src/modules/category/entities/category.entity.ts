import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;
@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

}

export const CategorySchema = SchemaFactory.createForClass(Category);
