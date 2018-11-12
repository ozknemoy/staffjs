import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData} from '../../../shared/services/handle-data';
import IArmy from '../../../../../server/components/personnel/relations/personnel-army.interface';

@Component({
  selector: 'staff-army',
  templateUrl: './army-edit.component.html'
})
export class ArmyComponent implements OnInit {
  id: string;
  private dateProps: (keyof IArmy)[] = [];
  public army = new IArmy(this.route.snapshot.parent.params.id);
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/army`)
      .then((army: IArmy) => {
        // если паспорт уже создан . иначе будет пустая модель
        if (army) {
          this.army = HandleData.handleDatesInObjectFromServer(army, this.dateProps)
        }
      })
  }

  save() {
    const tbl = HandleData.handleDatesInObjectToServer(this.army, this.dateProps);
    this.http.putWithToast(`/personnel/${this.id}/army`, tbl)
      .then((d) => this.army = HandleData.handleDatesInObjectFromServer(<any>d, this.dateProps));
  }

}
