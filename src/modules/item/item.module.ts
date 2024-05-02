import { Module } from '@nestjs/common';
import { ItemsController } from './item.controller';
import { ItemsService } from './item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './entities/item.entity';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]), AwsModule],
  controllers: [ItemsController],
  providers: [ItemsService]
})
export class ItemModule {}
