import {Body, Controller, Get, Post, UseFilters, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {UserService} from "./user.service";
import {ExceptionFilter} from "../../filters/rpc-exception.filter";
import {RpcException} from "@nestjs/microservices";


@Controller('user')
export class UserController {

  constructor(private readonly UserService: UserService,) {}

  @Get('all')
  @UseGuards(AuthGuard())
  findAll() {
    console.log('2');
    return [];
  }

  @Post('/login')
  signIn(@Body() body) {
    return this.UserService.signIn(body)
  }

  @Post('/superadmin')
  //@UseFilters(new ExceptionFilter())
  createSA(@Body() body) {
    return this.UserService.createSA(body)
      .catch(e=> {
        console.log('00000000000000000000', e);
        throw new RpcException(e);
      })
  }




  @Get(':id')
  rootGet() {
    console.log('1');
    return {oneUser: 1}
  }


}
