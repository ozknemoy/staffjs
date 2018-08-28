import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IPersonnel} from "../../../../server/components/personnel/personnel.interface";
import {ActivatedRoute} from "@angular/router";
import {IFamily} from "../../../../server/components/personnel/relations/personnel-family.interface";
import * as _ from 'lodash/core'

declare const pdfMake;
@Component({
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html'
})
export class StaffEditComponent implements OnInit {

  worker = new IPersonnel();
  pdf = [];
  constructor(private httpClient: HttpClient, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.worker = await this.httpClient.get<any>('/personnel/' + this.route.snapshot.params.id).toPromise();
    this.pdfBuilder()
      .makeFamilyTable(this.worker.families)
      .build()
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
    this.httpClient.put<any>('/personnel/' + this.worker.id, this.worker)
      .toPromise()
      .then((newWorker) => {
        this.worker = newWorker;
      });
  }

}
