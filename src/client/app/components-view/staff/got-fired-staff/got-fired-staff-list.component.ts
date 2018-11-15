import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {StaffListComponent} from "../staff-list.component";
import {HttpService} from "../../../services/http.service";

@Component({
  selector: 'app-got-fired-staff-list',
  templateUrl: '../staff-list.component.html'
})
export class GotFiredStaffListComponent extends StaffListComponent implements OnInit {
  public isGotFiredState = true;

  constructor(protected http: HttpService, protected router: Router) {
    super(http, router)
  }
}
