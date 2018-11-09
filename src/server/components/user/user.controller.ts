import {Body, Controller, Delete, Get, Param, Post, UseFilters, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {UserService} from "./user.service";
import {ExceptionFilter} from "../../filters/rpc-exception.filter";
import {RpcException} from "@nestjs/microservices";
import User from './user.model';


@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService,) {}

  @Get('all')
  @UseGuards(AuthGuard())
  findAll() {
    return User.findAll();
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
    return User.findById(id).then((user) => user.destroy())
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
