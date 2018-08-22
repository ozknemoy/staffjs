import {MiddlewaresConsumer, Module} from '@nestjs/common';
import { ApiController } from './api/api.controller';
import {StaffController} from './staff/staff.controller';
import {FRONT_ROUTES, RouterMiddleware} from '../configs/router.middleware';
import {MULTER_ROUTES, MulterMiddleware} from '../configs/multer.middleware';
import {StaffService} from "./staff/staff.service";
import {UploadController} from "./upload/upload.controller";
import {ErrHandler} from "../services/error-handler.service";
import {UploadService} from "./upload/upload.service";

@Module({
  imports: [],
  controllers: [ApiController, StaffController, UploadController],
  components: [
    StaffService,
    ErrHandler,
    UploadService,
  ],
})
export class MainModule {
    public configure(consumer: MiddlewaresConsumer): void {
        /*consumer.apply(RouterMiddleware).forRoutes(...FRONT_ROUTES);*/
        consumer.apply(MulterMiddleware).forRoutes(...MULTER_ROUTES);
    }
}
