import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData} from '../../../shared/services/handle-data';
import {IPersonnelNamedThingWithDoc} from '../../../../../server/components/personnel/relations/personnel-named-thing-with-doc.interface';

@Component({
  selector: 'staff-reward',
  templateUrl: './reward-edit.component.html'
})
export class RewardComponent implements OnInit {
  id: string;
  private dateProps: (keyof IPersonnelNamedThingWithDoc)[] = ['docDate'];
  public reward: IPersonnelNamedThingWithDoc[];
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/reward`)
      .toPromise()
      .then((d: IPersonnelNamedThingWithDoc[]) => this.reward = HandleData.handleDatesInArrFromServer(d, this.dateProps))
  }

  addRow() {
    this.reward.push(new IPersonnelNamedThingWithDoc())
  }

  deleteRow(i) {
    this.reward.splice(i, 1)
  }

  save() {
    const tbl = HandleData.handleDatesInArrToServer(this.reward, this.dateProps);
    this.http.put(`/personnel/${this.id}/reward`, tbl)
      .toPromise()
      .then((d) => this.reward = HandleData.handleDatesInArrFromServer(<any>d, this.dateProps));
  }

}
