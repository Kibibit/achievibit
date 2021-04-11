import {
  Body,
  Controller,
  Logger,
  NotFoundException,
  Param,
  UseFilters
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  GetAll,
  GetOne,
  KbDelete,
  KbPatch,
  KbPost,
  KbPut
} from '@kb-decorators';
import { KbValidationExceptionFilter } from '@kb-filters';
import { Product } from '@kb-models';

import { ProductService } from './product.service';

@Controller('api/product')
@ApiTags('product')
@UseFilters(new KbValidationExceptionFilter())
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @GetAll(Product)
  async getAllProducts() {
    const productsDB = await this.productService.findAllAsync();
    const products = productsDB
      .map((productDb) => new Product(productDb.toObject()));

    return products;
  }

  @GetOne(Product, ':name')
  async getProduct(@Param('name') name: string) {
    const product = await this.productService.findByName(name);

    if (!product) {
      throw new NotFoundException(`Product with name ${ name } not found`);
    }

    // will show secret fields as well!
    this.logger.log('Full Product');
    // will log only public fields!
    this.logger.log(product);
    // DANGER! WILL LOG EVERYTHING!
    console.log(product);

    // will only include exposed fields
    return product;
  }

  @KbPost(Product)
  async createProduct(@Body() item: Product) {

    const product = await this.productService.create(item);

    return product
  }

  @KbPatch(Product, ':name')
  async changeProduct(
    @Param('name') name: string,
    @Body() changes: Product
  ) {
    const existingProductDB = await this.productService.findOneAsync({ name });

    if (!existingProductDB) {
      throw new NotFoundException(`Product with name ${ name } not found`);
    }

    const existingProduct = new Product(existingProductDB.toObject());
    const product = await this.productService.updateAsync({
      ...existingProduct,
      ...changes
    })
    return product.toObject();
  }

  @KbPut(Product, ':name')
  async changeProduct2(
    @Param('name') name: string,
    @Body() changes: Product
  ) {
    const existingProductDB = await this.productService.findOneAsync({ name });
    const existingProduct = new Product(existingProductDB.toObject());
    const product = await this.productService.updateAsync({
      ...existingProduct,
      ...changes
    })
    return product.toObject();
  }

  @KbDelete(Product, ':name')
  async deleteProduct(@Param('name') name: string) {
    const product = await this.productService.deleteAsync({ name });

    const parsed = new Product(product.toObject());

    this.logger.log(parsed);

    // will only include exposed fields
    return parsed;
  }
}
