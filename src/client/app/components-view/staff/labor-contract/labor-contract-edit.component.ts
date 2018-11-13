import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData} from '../../../shared/services/handle-data';
import ILaborContract from '../../../../../server/components/personnel/relations/personnel-labor-contract.interface';
import {attractionTermsDict} from "../../../../../shared/dictionaries/attraction-terms.dict";

@Component({
  selector: 'staff-contracts',
  templateUrl: './labor-contract-edit.component.html'
})
export class LaborContractComponent implements OnInit {
  id: string;
  private dateProps: (keyof ILaborContract)[] = ['date', 'endDate', 'soutDate'];
  public contracts: ILaborContract[];
  public attractionTermsDict = attractionTermsDict;
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/labor-contract`)
      .then((d: ILaborContract[]) => this.contracts = HandleData.handleDatesInArrFromServer(d, this.dateProps))
  }

  addRow() {
    this.contracts.push(new ILaborContract(+this.id))
  }

  deleteRow(i) {
    this.contracts.splice(i, 1)
  }

  save() {
    const tbl = HandleData.handleDatesInArrToServer(this.contracts, this.dateProps);
    this.http.putWithToast(`/personnel/${this.id}/labor-contract`, tbl)
      .then((d) => this.contracts = HandleData.handleDatesInArrFromServer(<any>d, this.dateProps));
  }

}
