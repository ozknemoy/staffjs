import { Component, OnInit } from '@angular/core';
import {IPersonnel} from "../../../../../server/components/personnel/personnel.interface";
import {ActivatedRoute} from "@angular/router";
import {IFamily} from "../../../../../server/components/personnel/relations/personnel-family.interface";
import * as _ from 'lodash/core'
import {HttpService} from "../../../services/http.service";

declare const pdfMake;

@Component({
  selector: 'app-staff-main-info',
  templateUrl: './main-info-edit.component.html'
})
export class StaffMainInfoComponent implements OnInit {

  worker = new IPersonnel();
  pdf = [];
  // говорю беку не надо сохранять связь
  rel: string;
  constructor(protected http: HttpService, protected route: ActivatedRoute) { }

  async ngOnInit() {
    this.worker = await this.http.get(`personnel/${this.route.parent.snapshot.params.id}`).toPromise();
    /*this.pdfBuilder()
      .makeFamilyTable(this.worker.families)
      .build()*/
  }

  makeFamilyTable(f: IFamily[]) {
    return this;
  }

  build() {
    const w = window.open('http://localhost:4200/staff-edit/29', '_blank ');
    pdfMake.createPdf({content: [this.pdf]}).open({}, w);
  }

  pdfBuilder() {
    return this
  }

  addFamily() {
    this.worker.families.push(<any>{})
  }

  deleteFamily(i) {
    this.worker.families.splice(i, 1)
  }

  save() {
    console.log(this.worker.educationName);
    const suffix = this.rel ? `/with-rel/${this.rel}` : '';
    this.http.put(`personnel/${this.worker.id + suffix}`, this.worker)
      //.toPromise()
      .subscribe((newWorker) => {
        this.worker = <any>newWorker;
      });
  }

}
