import {Controller, Post, Query, Res} from "@nestjs/common";
import {PrintService} from "./print.service";


@Controller('print')
export class PrintComponent {
  constructor(private printService: PrintService) {

  }

  @Post('t2')
  printT2(@Query('userId') userId: string, @Res() resp) {
    return this.printService.saveLocalForDevelopment()
    /*return this.printService.printT2(userId).then(data => {
      resp.contentType('application/pdf; charset=utf-8');
      resp.setHeader('content-disposition', 'attachment; filename=somename.pdf');
      return resp.send(data);
    })*/
  }

}
