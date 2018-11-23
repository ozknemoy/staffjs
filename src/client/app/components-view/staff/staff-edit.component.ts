import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from '../../services/http.service';
import {ILaborContractDocx} from "../../../../server/components/print/labor-contract-docx.interface";
import {HandleData} from "../../../../shared/handle-data";

@Component({
  selector: 'app-staff-edit',
  templateUrl: 'staff-edit.component.html'
})
export class StaffEditComponent implements OnInit {
  contracts: ILaborContractDocx[];
  id;
  constructor(private route: ActivatedRoute, private httpService: HttpService) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.httpService.get('print/labor-contract/all').then((contracts) => {
      this.contracts = contracts;
    })
  }
}
