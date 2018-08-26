import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {IPersonnel} from "../../../../server/components/personnel/personnel.interface";

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html'
})
export class StaffListComponent implements OnInit {

  staffList: IPersonnel[];

  constructor(private httpClient: HttpClient) { }

  async ngOnInit() {
    this.staffList = await this.httpClient.get<IPersonnel[]>('/personnel').toPromise();
  }

}