import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IPersonnel} from "../../../../server/components/personnel/personnel.interface";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html'
})
export class StaffEditComponent implements OnInit {

  worker = new IPersonnel();
  constructor(private httpClient: HttpClient, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.worker = await this.httpClient.get<any>('/personnel/' + this.route.snapshot.params.id).toPromise();
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
