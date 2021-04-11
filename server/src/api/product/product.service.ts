import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { BaseService } from '../../abstracts/base.service.abstract';
import { Product } from '../../models/product.model';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectModel(Product.modelName)
    private readonly productModel: ReturnModelType<typeof Product>,
  ) {
    super(productModel, Product);
  }

  async findByName(name: string): Promise<Product> {
    const dbProduct = await this.findOne({ name }).exec();

    if (!dbProduct) {
      return;
    }

    return new Product(dbProduct.toObject());
  }
}
