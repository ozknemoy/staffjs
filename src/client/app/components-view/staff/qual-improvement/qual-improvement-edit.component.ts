import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import IQualImprovement from "../../../../../server/components/personnel/relations/personnel-qual-improvement.interface";
import {HandleData} from '../../../shared/services/handle-data';

@Component({
  selector: 'staff-qual-improvement',
  templateUrl: './qual-improvement-edit.component.html'
})
export class QualImprovementComponent implements OnInit {
  id: string;
  private dateProps: (keyof IQualImprovement)[] = ['startEduDate', 'endEduDate', 'docDate'];
  public qualImprovement: IQualImprovement[];
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/qual-improvement`)
      .then((d: IQualImprovement[]) => this.qualImprovement = HandleData.handleDatesInArrFromServer(d, this.dateProps))
  }

  addRow() {
    this.qualImprovement.push(new IQualImprovement())
  }

  deleteRow(i) {
    this.qualImprovement.splice(i, 1)
  }

  save() {
    const tbl = HandleData.handleDatesInArrToServer(this.qualImprovement, this.dateProps);
    this.http.putWithToast(`/personnel/${this.id}/qual-improvement`, tbl)
      .then((d) => this.qualImprovement = HandleData.handleDatesInArrFromServer(<any>d, this.dateProps));
  }

}
