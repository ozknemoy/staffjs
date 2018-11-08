import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from './user.service';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException,} from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'auth-in-nest-js-and-angular-463525b6e071',
    });
  }

  async validate(payload) {
    console.log('*************validate****************', payload);
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}