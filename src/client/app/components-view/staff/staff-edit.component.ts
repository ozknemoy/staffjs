import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IPersonnel} from "../../../../server/components/personnel/personnel.interface";
import {ActivatedRoute} from "@angular/router";
import {IFamily} from "../../../../server/components/personnel/personnel-family.interface";
declare const pdfMake;
@Component({
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html'
})
export class StaffEditComponent implements OnInit {

  worker = new IPersonnel();
  constructor(private httpClient: HttpClient, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.worker = await this.httpClient.get<any>('/personnel/' + this.route.snapshot.params.id).toPromise();
    if(this.worker.family && this.worker.family.length) this.makeFamilyTable(this.worker.family)
  }

  makeFamilyTable(f) {
    const body = f.map((row: IFamily) => [row.relationshipDegree, row.fullName, row.birthYear]);
    const tbl = {
      table: {
        widths: [100, '*', '*'],
        body: [['Степень родства (ближайшие родственники)', 'Фамилия, имя, отчество', 'Год рождения']]
            .concat(body)
      }
    };

    const w = window.open('http://localhost:4200/staff-edit/29', '_blank ');
    pdfMake.createPdf({content: [tbl]}).open({}, w);
  }

  addFamily() {
    this.worker.family.push(<any>{})
  }

  deleteFamily(i) {
    this.worker.family.splice(i, 1)
  }

  save() {
    this.httpClient.put<any>('/personnel/' + this.worker.id, this.worker)
      .toPromise()
      .then((newWorker) => {
        this.worker = newWorker;
      });
  }

}
