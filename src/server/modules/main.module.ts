import { Module } from '@nestjs/common';
import { ApiController } from './api/api.controller';
import {StaffController} from './staff/staff.controller';

@Module({
  imports: [],
  controllers: [ApiController, StaffController],
  components: [],
})
export class MainModule {}
