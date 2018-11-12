import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent {
  constructor(private httpService: HttpService) {
  }

  fillDBPersonnelByLocalXls(mass: boolean) {
    this.httpService.postWithToast(
      'upload/fill-db-by-local-xls',
      {mass},
      'Успешно сохранено. перезагрузите страницу'
    )
      .then(() => {})
  }

}
