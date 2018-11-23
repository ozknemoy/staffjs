import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../services/http.service';
import * as _ from 'lodash';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent {
  constructor(private httpService: HttpService, private toast: ToastrService) {
  }

  fillDBPersonnelByLocalXls(mass: boolean) {
    this.httpService.postWithToast(
      'upload/fill-db-by-local-xls',
      {mass},
      'Сохраняю. перезагрузите страницу через некоторое время'
    )
      .then(() => {})
  }

  fillDBQualificationUpXls() {
    this.httpService.postWithToast(
      'upload/qualification-up',
      {},
      'Сохраняю...'
    )
      .then((d: any[]) => {
        const all = d.length;
        const fail = _.sumBy(d, (row) => Number(!row));
        const success = all - fail;
        this.toast.info(
          `Всего работников: ${all}. Успешно: ${success}. Не сопоставлено работиков ${fail}`,
          '', {timeOut: 30e3})
      })
  }

}
