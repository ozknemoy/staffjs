import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData} from '../../../../../shared/handle-data';
import IAttestation from '../../../../../server/components/personnel/relations/personnel-attestation.interface';

@Component({
  selector: 'staff-attestation',
  templateUrl: './attestation-edit.component.html'
})
export class AttestationComponent implements OnInit {
  id: string;
  private dateProps: (keyof IAttestation)[] = ['date', 'docDate'];
  public attestations: IAttestation[];
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/attestation`)
      .then((d: IAttestation[]) => this.attestations = HandleData.handleDatesInArrFromServer(d, this.dateProps))
  }

  addRow() {
    this.attestations.push(new IAttestation())
  }

  deleteRow(i) {
    this.attestations.splice(i, 1)
  }

  save() {
    const tbl = HandleData.handleDatesInArrToServer(this.attestations, this.dateProps);
    this.http.putWithToast(`/personnel/${this.id}/attestation`, tbl)
      .then((d) => this.attestations = HandleData.handleDatesInArrFromServer(<any>d, this.dateProps));
  }

}
