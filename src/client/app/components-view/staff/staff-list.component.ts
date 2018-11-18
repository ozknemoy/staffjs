import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IPersonnel} from "../../../../server/components/personnel/personnel.interface";
import {Router} from "@angular/router";
import * as _ from 'lodash';
import {HttpService} from "../../services/http.service";
import {IServerFilter} from "../../../../shared/interfaces/server-filter.interface";
import {staffCategoriesDict} from "../../../../shared/dictionaries/staff-categories.dict";

class IFltr  {
  surname: null
}

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html'
})
export class StaffListComponent implements OnInit {
  public currentPage = 1;
  public amount = 0;
  public amountW = 0;
  public amountM = 0;
  public staffList: IPersonnel[];
  public isGotFiredState = false;
  public fltr = new IFltr();
  public fltrServer = new IServerFilter();
  public staffCategoriesDict = staffCategoriesDict;
  public sliderOptions = {
    floor: 10,
    ceil: 100,
    step: 1
  };
  constructor(protected http: HttpService, protected router: Router) { }

  async ngOnInit() {
    let url = '/personnel';
    if(this.isGotFiredState) {
      url += '?inactive=true'
    }
    this.staffList = await this.http.get<IPersonnel[]>(url);
    this.afterGetStaff()
  }

  afterGetStaff() {
    this.amount = this.staffList.length;
    this.amountW = _.sumBy(
      this.staffList,
      ({sex}) => Number(sex === 'ж')
    );
    this.amountM = _.sumBy(
      this.staffList,
      ({sex}) => Number(sex === 'м')
    );
  }

  createNewOne() {
    this.http.post('/personnel', {})
      .then(id => this.router.navigate(['/staff-edit', id]));
  }

  deleteOne(id, i, destroy: boolean) {
    return destroy ? this.destroyOne(id) : this.getFiredOne(id)
      .then(() => {
        this.staffList.splice(i, 1);
        this.afterGetStaff();
      });
  }

  getFiredOne(id) {
    return this.http.put('/personnel/' + id, {active: false})
  }

  restoreOne(id, i) {
    return this.http.put('/personnel/' + id, {active: true})
      .then(() => {
        this.staffList.splice(i, 1);
        this.afterGetStaff();
      });
  }

  destroyOne(id) {
    return this.http.delete('/personnel/' + id)
  }

  filterServer() {
    this.http.post('/personnel/filter', this.fltrServer).then((staffList) => {
      this.staffList = staffList;
      this.fltr = new IFltr();
      this.afterGetStaff();
    });
  }

  trackByFn(index, item) {
    return item.id
  }
}
