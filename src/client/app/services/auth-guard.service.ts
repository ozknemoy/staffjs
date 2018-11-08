/**
 * Created by ozknemoy on 14.01.2017.
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad} from '@angular/router';
import {HttpService} from "./http.service";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(
        public router: Router,
        public httpService: HttpService
    ) {}

    canActivate() {
        return this.checkLogin();
    }

    canLoad() {
        return this.checkLogin();
    }

    checkLogin(): boolean {
        return true
        /*if (!this.httpService.isAuth()) {
            this.router.navigate(['']);
            return false
        }
        else {
            return true
        }*/
    }
}
