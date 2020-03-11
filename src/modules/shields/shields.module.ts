import { Module } from '@nestjs/common';

import { ConfigModule } from '@kb-config';

import { ShieldsController } from './shields.controller';
import { ShieldsService } from './shields.service';

@Module({
  imports: [ ConfigModule ],
  providers: [ ShieldsService ],
  controllers: [ ShieldsController ]
})
export class ShieldsModule { }
