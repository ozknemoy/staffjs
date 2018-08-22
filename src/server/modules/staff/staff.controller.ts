import {Controller, Get} from '@nestjs/common';
import {StaffService} from "./staff.service";


@Controller('staff')
export class StaffController {

  constructor(private staffService: StaffService) {}

  @Get()
  getStaff() {
    return this.staffService.getAllStaff();
  }
}
