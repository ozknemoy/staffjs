import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import IWorkExp from '../../../../../server/components/personnel/relations/personnel-work-exp.interface';

@Component({
  selector: 'staff-work-exp',
  templateUrl: './work-exp-edit.component.html'
})
export class WorkExpComponent implements OnInit {
  id: string;
  public workExp: IWorkExp[];
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/work-exp`)
      .toPromise()
      .then((d: IWorkExp[]) => this.workExp = d)
  }

  save() {
    this.http.put(`/personnel/${this.id}/work-exp`, this.workExp)
      .toPromise()
      .then((d) => this.workExp = <any>d);
  }

}
