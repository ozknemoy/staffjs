import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IStaff} from "../../../../server/components/personnel/personnel.interface";
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";

@Component({
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html'
})
export class StaffEditComponent implements OnInit {

  worker = new IStaff();
  constructor(private httpClient: HttpClient, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.worker = await this.httpClient.get<any>('/personnel/' + this.route.snapshot.params.id).toPromise();
  }

}
