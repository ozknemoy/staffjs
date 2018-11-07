import { JwtService } from '@nestjs/jwt';
import User from "./user.model";
import {Injectable} from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,) {}

  async signIn(): Promise<string> {
    // In the real-world app you shouldn't expose this method publicly
    // instead, return a token once you verify user credentials
    const user = {login: 'user'};
    return this.jwtService.sign(user);
  }

  async validateUser({login}): Promise<any> {
    console.log('++++++++++++++++validateUser++++++++++++++++++++', login);
    return await User.findOne({where: {login}});
  }
}