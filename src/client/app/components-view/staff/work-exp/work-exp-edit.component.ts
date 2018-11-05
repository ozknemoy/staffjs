import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import IWorkExp from '../../../../../server/components/personnel/relations/personnel-work-exp.interface';
import {workExpTypesDict} from '../../../../../shared/work-exp-types.dict';
import {StaffMainInfoComponent} from "../main-info/main-info-edit.component";

@Component({
  selector: 'staff-work-exp',
  templateUrl: './work-exp-edit.component.html'
})
export class WorkExpComponent extends StaffMainInfoComponent implements OnInit {
  rel = 'work-exp';
  public workExpTypesDict = workExpTypesDict;
  constructor(protected http: HttpService, protected route: ActivatedRoute) {
    super(http, route)
  }

  afterInit() {
    this.worker.workExp = this.worker.workExp.sort((a, b) => a.id > b.id ? 1 : -1)
  }

  afterSave() {
    this.afterInit();
  }

}
