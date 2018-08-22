import {Injectable} from '@angular/core';
import Staff, {IStaff} from "./staff.interface";
import {Component} from "@nestjs/common";
import {staffJsDB} from "../../configs/staffjs.database";
import {QueryTypes} from "sequelize";

@Component()
export class StaffService {

  getAllStaff() {

    return staffJsDB.query(`SELECT * FROM Staff`).spread((results, metadata) => results);
    /*Staff.findAll();*/
  }
}
