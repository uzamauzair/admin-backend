import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/category/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemModule } from './modules/item/item.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://next-amazona-v2:Cst1902626@cluster0.h27iq8x.mongodb.net/quick_eats?retryWrites=true&w=majority&appName=Cluster0'), CategoriesModule, ItemModule,
    // ConfigModule.forRoot({isGlobal: true,})
  ],
})
export class AppModule {}
