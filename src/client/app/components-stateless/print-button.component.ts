/**
 * Created by ozknemoy on 16.01.2017.
 */
import {Component, Input, HostListener} from '@angular/core';
import {HttpService} from "../services/http.service";


@Component({
  selector: 'print-button',
  template: '<button class="btn btn-info btn-sm">{{text}}</button>'
})

export class PrintButtonComponent {
  @Input() url: string;
  @Input() text = 'Печать';

  constructor(public httpService: HttpService) {}

  @HostListener('click')
  click() {
    this.httpService.post(this.url, {})
      .subscribe(file => {

      })
  }


}
