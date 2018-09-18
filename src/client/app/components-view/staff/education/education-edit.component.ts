import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {StaffMainInfoComponent} from "../main-info/main-info-edit.component";
import IInstitution from "../../../../../server/components/personnel/relations/personnel-institution.interface";

@Component({
  selector: 'staff-education',
  templateUrl: './education-edit.component.html'
})
export class EducationEditComponent extends StaffMainInfoComponent  {
  id: string;
  rel = 'institution';
  constructor(protected http: HttpService, protected route: ActivatedRoute) {
    super(http, route)
  }

  addRow() {
    this.worker.institutions.push(new IInstitution(+this.id))
  }

  deleteRow(i) {
    this.worker.institutions.splice(i, 1)
  }

}
