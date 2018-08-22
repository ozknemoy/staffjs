import {Controller, Post, Req, Headers} from "@nestjs/common";
import {UploadService} from "./upload.service";
import {ErrHandler} from "../../services/error-handler.service";

@Controller('upload')
export class UploadController {

  constructor(private uploadService: UploadService, private errHandler: ErrHandler) {

  }

  @Post('personnel')
  async uploadPersonnel(@Headers() headers, @Req() {files})/*:PromiseLike<IFileUpload>*/ {

    return this.uploadService.readExcelFile(files[0])
      /*.catch((e) => this.errHandler.sentToFront(e))*/
  }


}
