import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Product } from '../../models/product.model';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.modelName, schema: Product.schema }
    ])
  ],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
