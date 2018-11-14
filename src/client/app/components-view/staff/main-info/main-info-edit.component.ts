import { Component, OnInit } from '@angular/core';
import {IPersonnel} from "../../../../../server/components/personnel/personnel.interface";
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData} from "../../../shared/services/handle-data";
import {attractionTermsDict} from "../../../../../shared/dictionaries/attraction-terms.dict";

@Component({
  selector: 'app-staff-main-info',
  templateUrl: './main-info-edit.component.html'
})
export class StaffMainInfoComponent implements OnInit {

  worker = new IPersonnel();
  private dateProps: (keyof IPersonnel)[] = ['contractDate', 'workExpDate', 'membershipGANDate', 'membershipOANDate', 'medicalCertDate', 'psychoCertDate',];
  // говорю беку не надо сохранять связь
  rel: string;
  public attractionTermsDict = attractionTermsDict;
  constructor(protected http: HttpService, protected route: ActivatedRoute) { }

  async ngOnInit() {
    const suffix = this.rel ? `?withRel=${this.rel}` : '';
    const worker = await this.http.get(`personnel/${this.route.parent.snapshot.params.id + suffix}`);
    this.worker = HandleData.handleDatesInObjectFromServer(worker, this.dateProps);
    this.afterInit();
  }

  afterInit() {

  }

  afterSave() {

  }

  save() {
    const suffix = this.rel ? `/with-rel/${this.rel}` : '';
    const worker = HandleData.handleDatesInObjectToServer(this.worker, this.dateProps);
    this.http.putWithToast(`personnel/${this.worker.id + suffix}`, worker)
      .then((newWorker) => {
        this.worker = HandleData.handleDatesInObjectFromServer(<any>newWorker, this.dateProps);
        this.afterInit();
      });
  }

}
