import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IPersonnel} from "../../../../server/components/personnel/personnel.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html'
})
export class StaffListComponent implements OnInit {

  staffList: IPersonnel[];

  constructor(private http: HttpClient, private router: Router) { }

  async ngOnInit() {
    this.staffList = await this.http.get<IPersonnel[]>('/personnel').toPromise();
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
