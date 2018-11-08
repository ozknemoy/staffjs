import { Component, OnInit } from '@angular/core';
import {HttpService} from '../services/http.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-about',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  public info = {
    login: '',
    password: ''
  };
  constructor(private http: HttpService, private router: Router) { }

  login() {
    this.http.post('user/login', this.info).subscribe((d) => {
      localStorage.setItem('bearer', (<any>d).token);
      this.router.navigate(['staff-list']);
    })
  }

}
