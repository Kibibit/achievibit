import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

import { UsersService } from '@kb-modules';

import { OauthService } from './oauth.service';

const GITHUB_CLIENT_ID = 'Iv1.36ea4804d94b4391';
const GITHUB_CLIENT_SECRET = 'bd598cfb3f835bb8f813caa8bc0dfee7a86a04dc';

export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(private oauthService: OauthService, usersService: UsersService) {
    super({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    },
      (accessToken, refreshToken, profile, done) => {
        usersService.findOne(profile.id)
          .then((user) => done(undefined, user))
          .catch((error) => done(error));
      });
  }
}
