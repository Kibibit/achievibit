import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApiController } from './api.controller';
import { ProductModule } from './product/product.module';
import { RepoModule } from './repo/repo.module';
import { UserModule } from './user/user.module';

@Module({
  controllers: [ApiController],
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    ProductModule,
    UserModule,
    RepoModule
  ]
})
export class ApiModule {}
