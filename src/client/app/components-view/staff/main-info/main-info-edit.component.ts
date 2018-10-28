import { Component, OnInit } from '@angular/core';
import {IPersonnel} from "../../../../../server/components/personnel/personnel.interface";
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData} from "../../../shared/services/handle-data";

@Component({
  selector: 'app-staff-main-info',
  templateUrl: './main-info-edit.component.html'
})
export class StaffMainInfoComponent implements OnInit {

  worker = new IPersonnel();
  private dateProps: (keyof IPersonnel)[] = ['contractDate'];
  // говорю беку не надо сохранять связь
  rel: string;
  constructor(protected http: HttpService, protected route: ActivatedRoute) { }

  async ngOnInit() {
    const suffix = this.rel ? `?withRel=${this.rel}` : '';
    const worker = await this.http.get(`personnel/${this.route.parent.snapshot.params.id + suffix}`).toPromise();
    this.worker = HandleData.handleDatesInObjectFromServer(worker, this.dateProps)
  }

  save() {
    const suffix = this.rel ? `/with-rel/${this.rel}` : '';
    this.http.put(`personnel/${this.worker.id + suffix}`, this.worker)
      .toPromise()
      .then((newWorker) =>
        this.worker = HandleData.handleDatesInObjectFromServer(<any>newWorker, this.dateProps)
      );
  }

}
