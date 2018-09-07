import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData} from '../../../shared/services/handle-data';
import {ISocialSecurity} from '../../../../../server/components/personnel/relations/personnel-social-security.interface';

@Component({
  selector: 'staff-social-security',
  templateUrl: './social-security.component.html'
})
export class SocialSecurityComponent implements OnInit {
  id: string;
  private dateProps: (keyof ISocialSecurity)[] = ['docDate'];
  public socialSec: ISocialSecurity[];
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/social-security`)
      .toPromise()
      .then((d: ISocialSecurity[]) => this.socialSec = HandleData.handleDatesInArrFromServer(d, this.dateProps))
  }

  addRow() {
    this.socialSec.push(new ISocialSecurity())
  }

  deleteRow(i) {
    this.socialSec.splice(i, 1)
  }

  save() {
    const tbl = HandleData.handleDatesInArrToServer(this.socialSec, this.dateProps);
    this.http.put(`/personnel/${this.id}/social-security`, tbl)
      .toPromise()
      .then((d) => this.socialSec = HandleData.handleDatesInArrFromServer(<any>d, this.dateProps));
  }

}
