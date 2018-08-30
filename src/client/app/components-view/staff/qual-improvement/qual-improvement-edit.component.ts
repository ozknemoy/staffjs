import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import IQualImprovement from "../../../../../server/components/personnel/relations/personnel-qual-improvement.interface";

@Component({
  selector: 'staff-qual-improvement',
  templateUrl: './qual-improvement-edit.component.html'
})
export class QualImprovementComponent implements OnInit {
  id: string;
  public qualImprovement: IQualImprovement[];
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/qual-improvement`)
      .toPromise()
      .then((d: IQualImprovement[]) => this.qualImprovement = d)
  }

  addRow() {
    this.qualImprovement.push(new IQualImprovement())
  }

  deleteRow(i) {
    this.qualImprovement.splice(i, 1)
  }

  save() {
    this.http.put(`/personnel/${this.id}/qual-improvement`, this.qualImprovement)
      .toPromise()
      .then((d) => this.qualImprovement = <any>d);
  }

}
