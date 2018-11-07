import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException,} from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload) {
    console.log('*************validate****************', payload);
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new Error/*UnauthorizedException*/();
    }
    return user;
  }
}