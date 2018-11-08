import {Controller, Get, Req} from '@nestjs/common';

@Controller('api')
export class ApiController {

  @Get('hello')
  root(@Req() req) {
    console['log']('______________________', Object.keys(req.headers), req.headers);

    return {
      message: 'Hello World!',
    };
  }
}
