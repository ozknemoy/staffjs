import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {PingService} from './shared/services/ping.services';
import {Observable} from 'rxjs/Observable';
import {ToastsManager} from "ng2-toastr";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  pongMessage$: Observable<any>;

  constructor(private pingService: PingService,
              toast: ToastsManager,
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
}
