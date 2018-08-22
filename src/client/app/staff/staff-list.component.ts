import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {IStaff} from "../../../server/modules/staff/staff.interface";

@Component({
  selector: 'staff-list',
  templateUrl: './staff-list.component.html'
})
export class StaffListComponent implements OnInit {

  staffList$: Observable<IStaff>;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.staffList$ = this.httpClient.get<any>('/staff');
  }

}
