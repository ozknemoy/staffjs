import {Body, Controller, Delete, Get, Param, Post, UseFilters, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {UserService} from "./user.service";
import User from './user.model';
import {ErrHandler} from "../../services/error-handler.service";
import {Sequelize} from "sequelize-typescript";


@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(AuthGuard())
  findAll() {
    return User.findAll({where: {rights: {[Sequelize.Op.not]: 1}}});
  }

  @Post('/login')
  signIn(@Body() body) {
    return this.userService.signIn(body)
  }

  @Post('/superadmin')
  //@UseFilters(new ExceptionFilter())
  createSA(@Body() body) {
    return this.userService.createSA(body)
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.getFullUserById(id).then((user) => {
      if(user.rights === 1) {
        ErrHandler.throw('нет прав', 401)
      }
      user.destroy()
    })
  }

  @Post('/new')
  createUser(@Body() body) {
    return this.userService.createAdmin(body)
  }


  @Get(':id')
  rootGet() {
    console.log('1');
    return {oneUser: 1}
  }


}
