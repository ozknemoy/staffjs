import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ILaborContractDocx} from "../../../../server/components/print/labor-contract-docx.interface";

@Component({
  selector: 'employment-contract',
  templateUrl: './employment-contract.component.html'
})
export class EmploymentContractComponent implements OnInit {
  contracts: ILaborContractDocx[];
  size = 1000000;
  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.get('print/labor-contract/all').then((contracts) => {
      this.contracts = contracts;
    })
  }

}
