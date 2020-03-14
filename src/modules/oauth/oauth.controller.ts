import { Controller, Get } from '@nestjs/common';

@Controller('api/oauth')
export class OauthController {
  @Get("github")
  public async githubSignIn() {
  }

  @Get("github/callback")
  public async githubCallBack() {
  }
}
