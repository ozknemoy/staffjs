/**
 * Created by ozknemoy on 16.01.2017.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ToastsManager} from "ng2-toastr";
import {HttpService} from "../../services/http.service";

/*
 <file-uploader [size]="1000000" uploaderClass="btn btn-warning btn-sm"
    accept=".jpeg,.jpg,.png,.pdf"
    (callback)="uploader=$event"></file-uploader>


* uploader.getNotUploadedItems().length
* [disabled]="!uploader.isUploading"
* {{ item?.file?.size/1024/1024 | number:'.2' }} MB
*
* [disabled]="!uploader.queue.length"
* uploader.uploadAll()
* uploader.cancelAll()
* uploader.clearQueue()
*
* *ngFor="let item of uploader.queue"
* item.isReady || item.isUploading || item.isSuccess
* [ngStyle]="{ 'width': item.progress + '%' }"
* item.upload()
* item.cancel()
* item.remove()
*
* */

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader-prioriti.html'
})

export class FileUploaderComponent {
  @Input() size = 2e6;
  @Input() uploaderClass: string;
  @Input() filename: string;
  @Input() url = 'upload';
  @Input() accept = '.jpeg,.jpg,.png';
  @Output() callback: EventEmitter<string> = new EventEmitter();
  uploader: any;

  constructor(public httpService: HttpService,
              private toast: ToastsManager) {


  }

  ngOnInit() {
    this.uploader = this.httpService.uploadFileWithAuth(this.size, this.url, this.filename);
    //после загрузки
    this.uploader.onCompleteItem = (f, i) => {
      this.callback.emit();
      this.toast.success(`Файл загружен`, '', {
        showCloseButton: true,
        toastLife: 7e3
      });
    };
    // при ошибке добавления файла
    this.uploader.onWhenAddingFileFailed = (file) => {
      if (file.size > this.size) {
        // тостик о превышение допустимого размера
        this.toast.error(`Вы превысили макcимально допустимый размер ${Math.floor(this.size / 1024)} Кбайт. Ваш файл ${Math.floor(file.size / 1024)} Кбайт`, 'Ошибка!', {
          showCloseButton: true,
          toastLife: 22e3
        });
      }

    };
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }
  }

}
