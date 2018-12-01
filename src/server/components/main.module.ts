import {MiddlewareConsumer, Module} from '@nestjs/common';
import { ApiController } from './api/api.controller';
import {StaffController} from './personnel/personnel.controller';
import {PersonnelService} from "./personnel/personnel.service";
import {UploadController} from "./upload/upload.controller";
import {ErrHandler} from "../services/error-handler.service";
import {UploadService} from "./upload/upload.service";
import {DbTransactions} from "../services/db-transactions.service";
import {PrintController} from "./print/print.controller";
import {PrintService} from "./print/print.service";
import {UserController} from "./user/user.controller";
import {JwtStrategy} from "./user/jwt.strategy";
import {UserService} from "./user/user.service";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {DictController} from "./dict/dict.controller";
import {DictService} from "./dict/dict.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: 'auth-in-nest-js-and-angular-463525b6e071',
      signOptions: {
        expiresIn: 24 * 60 * 60,
      },
    }),
  ],
  controllers: [
    ApiController,
    StaffController,
    UploadController,
    PrintController,
    UserController,
    DictController,
  ],
  providers: [
    PersonnelService,
    ErrHandler,
    UploadService,
    DbTransactions,
    PrintService,
    UserService,
    JwtStrategy,
    DictService,
  ],
})
export class MainModule {
  constructor(private personnelService: PersonnelService,
              private print: PrintService) {}
    public configure(consumer: MiddlewareConsumer): void {
        //new PrintService(this.personnelService).saveLocalForDevelopmentDocx();
      //this.print.saveLocalForDevelopmentPdf()
    }
}
