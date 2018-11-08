import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from './services/http.service';
import {Observable} from 'rxjs/index';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  pongMessage$: Observable<any>;

  constructor(
              private httpService: HttpService,
              private toast: ToastrService,
              vRef: ViewContainerRef) {
    // всегда надо инжектить в корневой компонент
    //toast.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
  }

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
