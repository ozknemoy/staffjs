import { Component, OnInit } from '@angular/core';
import {IPersonnel} from "../../../../server/components/personnel/personnel.interface";
import {Router} from "@angular/router";
import * as _ from 'lodash';
import {HttpService} from "../../services/http.service";
import {IServerFilter} from "../../../../shared/interfaces/server-filter.interface";
import {staffCategoriesDict} from "../../../../shared/dictionaries/staff-categories.dict";
import {attractionTermsDict} from "../../../../shared/dictionaries/attraction-terms.dict";
import {eduTypesDict} from '../../../../shared/dictionaries/edu-type.dict';

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
  public defaultServerFilter = new IServerFilter();
  public eduTypesDict = eduTypesDict;
  public sliderOptionsBirth = {
    floor: this.defaultServerFilter.birthDateMin,
    ceil: this.defaultServerFilter.birthDateMax,
    step: 1
  };
  public sliderOptionsContractEnd = {
    floor: this.defaultServerFilter.contractEndDateMin,
    ceil: this.defaultServerFilter.contractEndDateMax,
    step: 1
  };
  public attractionTermsDict = attractionTermsDict;
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

  clearFilter() {
    this.fltrServer = new IServerFilter();
  }

  createNewWorker() {
    this.http.post('/personnel', {})
      .then(id => this.router.navigate(['/staff-edit', id]));
  }

  deleteOne(id, destroy: boolean) {
    return (destroy ? this.destroyOne(id) : this.getFiredOne(id))
      .then(() => {
        this.staffList = this.staffList.filter(worker => worker.id !== id);
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

  filterServerXls() {
    this.http.downloadAndSave('/print/filter-and-xls', this.fltrServer)
  }

  trackByFn(index, item) {
    return item.id
  }
}
