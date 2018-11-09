import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Router} from "@angular/router";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(
    private httpService: HttpService,
    private toast: ToastrService
  ) {}

}
