
import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router/src/router_state";


@Injectable()
export class SuperAdminGuard implements CanActivate {

  constructor(public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('rights') !== '1') {
      this.router.navigate(['']);
      return false
    } else {
      return true
    }
  }
}
