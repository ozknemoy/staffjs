import {MiddlewaresConsumer, Module} from '@nestjs/common';
import { ApiController } from './api/api.controller';
import {StaffController} from './personnel/personnel.controller';
import {FRONT_ROUTES, RouterMiddleware} from '../configs/router.middleware';
import {MULTER_ROUTES, MulterMiddleware} from '../configs/multer.middleware';
import {PersonnelService} from "./personnel/personnel.service";
import {UploadController} from "./upload/upload.controller";
import {ErrHandlerService} from "../services/error-handler.service";
import {UploadService} from "./upload/upload.service";
import {DbTransactions} from "../services/db-transactions.service";

@Module({
  imports: [],
  controllers: [ApiController, StaffController, UploadController],
  components: [
    PersonnelService,
    ErrHandlerService,
    UploadService,
    DbTransactions,
  ],
})
export class MainModule {
    public configure(consumer: MiddlewaresConsumer): void {
        /*consumer.apply(RouterMiddleware).forRoutes(...FRONT_ROUTES);*/
        consumer.apply(MulterMiddleware).forRoutes(...MULTER_ROUTES);
    }
}
