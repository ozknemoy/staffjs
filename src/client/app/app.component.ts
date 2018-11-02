import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {PingService} from './shared/services/ping.services';
import {Observable} from 'rxjs/Observable';
import {ToastsManager} from "ng2-toastr";
import {HttpService} from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  pongMessage$: Observable<any>;

  constructor(private pingService: PingService,
              private httpService: HttpService,
              private toast: ToastsManager,
              vRef: ViewContainerRef) {
    // всегда надо инжектить в корневой компонент
    toast.setRootViewContainerRef(vRef);
  }

  ping() {
    this.pingService.sendPing(new Date());
  }

  ngOnInit() {

    this.pongMessage$ = this.pingService.getPong();
  }

  fillDBPersonnelByLocalXls() {
    this.httpService.post('upload/fill-db-by-local-xls', {})
      .toPromise()
      .then(() =>
        this.toast.success(`Успешно`, '', {
          showCloseButton: true,
          toastLife: 7e3
        })
    )
  }
}
