import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {IFamily} from "../../../../../server/components/personnel/relations/personnel-family.interface";


@Component({
  selector: 'app-staff-family-edit',
  templateUrl: './family-edit.component.html'
})
export class FamilyComponent implements OnInit {
  id: string;
  public families: IFamily[];

  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.http.get(`/personnel/${this.id}/family`)
      .toPromise()
      .then((d: IFamily[]) => this.families = d)
  }

  addRow() {
    this.families.push(new IFamily(+this.id))
  }

  deleteRow(i) {
    this.families.splice(i, 1)
  }

  save() {
    this.http.put(`/personnel/${this.id}/family`, this.families)
      .toPromise()
      .then((d) => this.families = <any>d);
  }

}
