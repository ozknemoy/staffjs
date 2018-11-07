import {Controller, Get, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";


@Controller('user')
export class UserController {
  @Get(':id')
  rootGet() {
    return {}
  }

  @Get('all')
  //@UseGuards(AuthGuard())
  findAll() {
    return [];
  }
}