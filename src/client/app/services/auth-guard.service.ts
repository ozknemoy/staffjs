
import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router/src/router_state";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!localStorage.getItem('bearer')) {
      this.router.navigate(['login']);
      return false
    }
    else {
      console.log('canActivatecanActivatecanActivate');
      return true
    }
  }

}