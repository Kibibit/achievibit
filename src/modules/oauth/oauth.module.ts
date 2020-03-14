import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';

@Module({
  providers: [OauthService],
  controllers: [OauthController]
})
export class OauthModule {}
