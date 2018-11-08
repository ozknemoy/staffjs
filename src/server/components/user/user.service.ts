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
  constructor(private readonly jwtService: JwtService,) {}

  async signIn({login, password}): Promise<{token: string}> {
    // In the real-world app you shouldn't expose this method publicly
    // instead, return a token once you verify user credentials
    const user = await this.validateUser({login});
    if(!user) {
      this.badCredentials();
    }
    const isValid = await this.checkPassword(password, user.password);
    if(!isValid) {
      this.badCredentials();
    }
    return {token: this.jwtService.sign({login})}
  }

  badCredentials() {
    ErrHandlerService.throw('Пара пароль/логин не валидна', HttpStatus.NOT_ACCEPTABLE);
  }

  async validateUser({login}): Promise<IUser> {
    return await User.findOne({where: {login}});
  }

  async createSA({login, password: _password}) {
    const password = await this.generateHash(_password);
    if(password) {
      return User.create({login, password, rights: 1})
    }
    return HttpErrorResponse
  }

  generateHash(password) {
    return new Promise((res, fail) => {
      bcrypt.hash(password, this.round/*, (e, hash) => {
        if(e) {
          console.error('----------generateHash------------', e);
          fail('----------generateHash------------')
        }
        res(hash);
      }*/);
    })

  }

  checkPassword(password, hash) {
    return bcrypt.compare(password, hash)
    /*return new Promise((res, fail) => {
      bcrypt.compare(password, this.round, (e, r) => {
        if(e) {
          fail('----------checkPassword------------')
        }
        res(r);
      });
    })*/
  }
}