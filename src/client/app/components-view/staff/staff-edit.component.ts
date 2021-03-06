import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from '../../services/http.service';
import {ILaborContractDocx} from "../../../../server/components/print/labor-contract-docx.interface";

@Component({
  selector: 'app-staff-edit',
  templateUrl: 'staff-edit.component.html'
})
export class StaffEditComponent implements OnInit {
  id;
  constructor(private route: ActivatedRoute, private httpService: HttpService) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
  }
}
