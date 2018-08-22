import {Injectable} from '@angular/core';
import {IStaff} from "./personnel.interface";
import {Component} from "@nestjs/common";
import {staffJsDB} from "../../configs/staffjs.database";
import {QueryTypes} from "sequelize";
import Staff from "./personnel.model";

@Component()
export class StaffService {

  getAllFullData() {
    return staffJsDB.query(`SELECT * FROM Staff`).spread((results, metadata) => results);
    /*Staff.findAll();*/
  }

  getAll() {
    return staffJsDB.query(`SELECT id, number, name  FROM Staff`).spread((results, metadata) => results);
  }

  getOne(id) {
    return Staff.findById(id)
  }
}
