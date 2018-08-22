import {Controller, Get, Param} from '@nestjs/common';
import {StaffService} from "./personnel.service";


@Controller('personnel')
export class StaffController {

  constructor(private staffService: StaffService) {}

  @Get()
  getStaff() {
    return this.staffService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id) {
    return this.staffService.getOne(id);
  }
}
