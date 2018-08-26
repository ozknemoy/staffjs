import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {PersonnelService} from "./personnel.service";
import {IPersonnel} from "./personnel.interface";


@Controller('personnel')
export class StaffController {

  constructor(private personnelService: PersonnelService) {}

  @Get()
  getStaff() {
    return this.personnelService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id) {
    return this.personnelService.getOne(id);
  }

  @Put(':id')
  updateOne(@Param('id') id, @Body() pers: IPersonnel) {
    return this.personnelService.updateOne(id, pers);
  }
}
