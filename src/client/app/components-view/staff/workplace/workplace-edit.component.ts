import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData} from '../../../../../shared/handle-data';
import IWorkplace from '../../../../../server/components/personnel/relations/personnel-workplace.interface';
import {attractionTermsDict} from "../../../../../shared/dictionaries/attraction-terms.dict";
import * as _ from 'lodash';
import {staffCategoriesDict} from "../../../../../shared/dictionaries/staff-categories.dict";
@Component({
  selector: 'staff-workplace',
  templateUrl: './workplace-edit.component.html'
})
export class WorkplaceComponent implements OnInit {
  id: string;
  public attractionTermsDict = attractionTermsDict;
  public staffCategoriesDict = staffCategoriesDict;
  private dateProps: (keyof IWorkplace)[] =
    ['date', 'dismissalDate', 'academicCouncilDate', 'dismissalDate', 'contractDate',
      'contractEndDate', 'soutDate'];
  public workplaces: IWorkplace[] = [];
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/workplace`)
      .then((workplaces: IWorkplace[]) => this.afterRetrieving(workplaces))
  }

  afterRetrieving(workplaces) {
    this.workplaces = _.orderBy(
      HandleData.handleDatesInArrFromServer(workplaces, this.dateProps),
      ['id'],
      ['desc']
    )
  }

  addRow() {
    this.workplaces.unshift(new IWorkplace(null))
  }

  deleteRow(i) {
    this.workplaces.splice(i, 1)
  }

  save() {
    const tbl = HandleData.handleDatesInArrToServer(this.workplaces, this.dateProps);
    this.http.putWithToast(`/personnel/${this.id}/workplace`, tbl)
      .then((workplaces: IWorkplace[]) => this.afterRetrieving(<any>workplaces))
  }

}
