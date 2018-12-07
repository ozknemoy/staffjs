import {Component} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../services/http.service';
import * as _ from 'lodash';
import {saveAs} from "file-saver";

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent {
  constructor(private httpService: HttpService, private toast: ToastrService) {
  }

  createWorkersFromXls(mass: boolean) {
    this.httpService.postWithToast(
      'upload/fill-db-by-local-xls',
      {mass},
      'Сохраняю. перезагрузите страницу через некоторое время'
    )
      .then(() => {})
  }

  fillDBQualificationUpXls() {
    this.httpService.postWithToastAtStart(
      'upload/qualification-up',
      {},
      'Сохраняю...'
    )
      .then((d: any[]) => {
        let fioFails: string[] = [];
        const all = d.length;
        // в случае не совпадения верну фио
        const fail = _.sumBy(d, (row) => {
          if(typeof row === 'string') {
            fioFails.push(row);
          }
          return Number(typeof row === 'string')
        });
        const success = all - fail;
        if(fioFails.length) {
          saveAs(new Blob([fioFails.join('\n')], {type: "text/plain;charset=utf-8"}),'ошибочные.txt')
        }
        this.toast.info(
          `Всего работников: ${all}. Успешно: ${success}. Не сопоставлено работиков ${fail}`,
          '',
          {timeOut: 100e3}
          )
      })
  }

}
