/**
 * Created by ozknemoy on 16.01.2017.
 */
import {Component, Input, HostListener} from '@angular/core';
import {HttpService} from "../services/http.service";
import {saveAs} from "file-saver";
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
    this.httpService.post(this.url, {}, undefined,
      {
        responseType: 'blob',
        // to display the full response & as 'body' for type cast
        observe: <'body'>'response',
      })
      .then((fullResponse) => {
        console.log(fullResponse['body']);
        saveAs(fullResponse['body'], HandleData.getFileNameFromHttpResponse(fullResponse));
        // скачивает из json исходника
        // pdfMake.createPdf(fullResponse.body).download(HandleData.getFileNameFromHttpResponse(fullResponse));
      })
  }

}
