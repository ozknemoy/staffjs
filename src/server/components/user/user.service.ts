import { JwtService } from '@nestjs/jwt';
import User from "./user.model";
import {HttpException, HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import {HttpErrorResponse} from "@angular/common/http";
import {RpcException} from "@nestjs/microservices";
import IUser from "./user.interface";
import {ErrHandlerService} from "../../services/error-handler.service";

const bcrypt = require('bcrypt');


@Injectable()
export class UserService {
  private round = 10;

  constructor(private readonly jwtService: JwtService) {}

  async signIn({login, password}): Promise<{token: string, rights: number}> {
    // In the real-world app you shouldn't expose this method publicly
    // instead, return a token once you verify user credentials
    const user = await this.validateUser({login});
    if (!user) {
      this.badCredentials();
    }
    const isValid = await this.checkPassword(password, user.password);
    if (!isValid) {
      this.badCredentials();
    }
    return {token: this.jwtService.sign({login}), rights: user.rights}
  }

  badCredentials() {
    ErrHandlerService.throw('Пара пароль/логин не валидна', HttpStatus.NOT_ACCEPTABLE);
  }

  async validateUser({login}): Promise<IUser> {
    return await User.findOne({where: {login}, attributes: ['id', 'login', 'rights', 'password']});
  }

  async createSA({login, password: password, pin}) {
    if (pin === '15646') {
      const _password = await this.generateHash(password);
      if (_password) {
        return User.create({login, _password, rights: 1})
      }
    }
    ErrHandlerService.throw('чего-то не хватает', 406)
  }

  async createAdmin({login, password, rights}) {
    if (rights > 1) {
      const _password = await this.generateHash(password);
      if (_password) {
        return User.create({login, _password, rights})
      }
    }
    ErrHandlerService.throw('Не правильные данные (логин надо латиницей, права выше 10)', 406)
  }

  generateHash(password) {
    return bcrypt.hash(password, this.round)
  }

  checkPassword(password, hash) {
    return bcrypt.compare(password, hash)
  }
}
