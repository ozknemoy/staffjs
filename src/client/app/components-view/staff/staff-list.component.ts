import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IPersonnel} from "../../../../server/components/personnel/personnel.interface";
import {Router} from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html'
})
export class StaffListComponent implements OnInit {
  public currentPage = 1;
  public amount: number;
  public amountW: number;
  public amountM: number;
  public staffList: IPersonnel[];

  constructor(private http: HttpClient, private router: Router) { }

  async ngOnInit() {
    this.staffList = await this.http.get<IPersonnel[]>('/personnel').toPromise();
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
    this.http.post('/personnel', {}).toPromise()
      .then(id => this.router.navigate(['/staff-edit', id]));
  }

  deleteOne(id, i) {
    this.http.delete('/personnel/' + id).toPromise()
      .then(id => this.staffList.splice(i, 1));
  }
}
