import {Controller, Get, Post, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "./auth.service";


@Controller('user')
export class UserController {

  constructor(private readonly AuthService: AuthService,) {}

  @Get('all')
  @UseGuards(AuthGuard())
  findAll() {
    console.log('2');
    return [];
  }

  @Post('/login')
  signIn() {
    return this.AuthService.signIn()
  }




  @Get(':id')
  rootGet() {
    console.log('1');
    return {}
  }
}