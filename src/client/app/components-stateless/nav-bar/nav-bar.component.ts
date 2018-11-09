import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent {
  constructor(
    private httpService: HttpService,
    private toast: ToastrService
  ) {}

  fillDBPersonnelByLocalXls(refill: boolean) {
    this.httpService.post('upload/fill-db-by-local-xls', {refill})
      .toPromise()
      .then(() =>
        this.toast.success(`Успешно`, '', {
          closeButton: true,
          timeOut: 7e3
        })
      )
  }

}
