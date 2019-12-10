import { Module } from '@nestjs/common';

import { AppService } from '../../app.service';
import { ShieldsController } from './shields.controller';
import { ShieldsService } from './shields.service';

@Module({
  providers: [ AppService, ShieldsService ],
  controllers: [ ShieldsController ]
})
export class ShieldsModule { }
