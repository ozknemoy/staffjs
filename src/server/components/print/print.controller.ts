import {Controller, Post, Query, Res, Response} from "@nestjs/common";
import {PrintService} from "./print.service";


@Controller('print')
export class PrintComponent {
  constructor(private printService: PrintService) {

  }

  @Post('t2')
  printT2(@Query('userId') userId: string, @Res() resp) {
    resp.contentType('application/text');
    console.time('1');
    this.printService.printT2(userId).then(d => {
      console.timeEnd('1');
      console.log('+++++++++++++++++++');
      return d
    })
  }


}
