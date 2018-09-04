import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData} from '../../../shared/services/handle-data';
import IProfRetraining from '../../../../../server/components/personnel/relations/personnel-prof-retraining.interface';

@Component({
  selector: 'staff-prof-retrainig',
  templateUrl: './prof-retrainig-edit.component.html'
})
export class ProfRetrainingComponent implements OnInit {
  id: string;
  private dateProps: (keyof IProfRetraining)[] = ['startEduDate', 'endEduDate', 'docDate'];
  public profRetrainings: IProfRetraining[];
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/prof-retrainig`)
      .toPromise()
      .then((d: IProfRetraining[]) => this.profRetrainings = HandleData.handleDatesInArrFromServer(d, this.dateProps))
  }

  addRow() {
    this.profRetrainings.push(new IProfRetraining())
  }

  deleteRow(i) {
    this.profRetrainings.splice(i, 1)
  }

  save() {
    const tbl = HandleData.handleDatesInArrToServer(this.profRetrainings, this.dateProps);

    this.http.put(`/personnel/${this.id}/prof-retrainig`, tbl)
      .toPromise()
      .then((d) => this.profRetrainings = HandleData.handleDatesInArrFromServer(<any>d, this.dateProps));
  }

}
