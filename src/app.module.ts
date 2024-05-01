import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/category/category.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://next-amazona-v2:Cst1902626@cluster0.h27iq8x.mongodb.net/quick_eats?retryWrites=true&w=majority&appName=Cluster0'), CategoriesModule,],
})
export class AppModule {}
