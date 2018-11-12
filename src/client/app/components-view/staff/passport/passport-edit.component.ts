import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData} from '../../../shared/services/handle-data';
import {IPassport} from '../../../../../server/components/personnel/relations/personnel-passport.interface';

@Component({
  selector: 'staff-passport',
  templateUrl: './passport-edit.component.html'
})
export class PassportComponent implements OnInit {
  id: string;
  private dateProps: (keyof IPassport)[] = ['birthDate', 'passportDate', 'passportRegDate'];
  public passport = new IPassport(this.route.snapshot.parent.params.id);
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.passport);

    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/passport`)
      .then((passport: IPassport) => {
        // если паспорт уже создан . иначе будет пустая модель
        if (passport) {
          this.passport = HandleData.handleDatesInObjectFromServer(passport, this.dateProps)
        }
      })
  }

  save() {
    const tbl = HandleData.handleDatesInObjectToServer(this.passport, this.dateProps);
    this.http.putWithToast(`/personnel/${this.id}/passport`, tbl)
      .then((d) => this.passport = HandleData.handleDatesInObjectFromServer(<any>d, this.dateProps));
  }

}
