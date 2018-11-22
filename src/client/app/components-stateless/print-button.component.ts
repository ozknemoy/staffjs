/**
 * Created by ozknemoy on 16.01.2017.
 */
import {Component, Input, HostListener} from '@angular/core';
import {HttpService} from "../services/http.service";
import {HandleData} from '../shared/services/handle-data';

@Component({
  selector: 'print-button',
  template: `
    <a href="javascript:">
      <ng-content></ng-content>
    </a>
  `
})

export class PrintButtonComponent {
  @Input() url: string;

  constructor(public httpService: HttpService) {}

  @HostListener('click')
  click() {
    this.httpService.downloadAndSave(this.url)
  }

}
