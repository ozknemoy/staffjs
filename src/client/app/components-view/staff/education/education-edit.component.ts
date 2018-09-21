import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../services/http.service';
import IInstitution from '../../../../../server/components/personnel/relations/personnel-institution.interface';
import {IPersonnel} from '../../../../../server/components/personnel/personnel.interface';
import {IPassport} from '../../../../../server/components/personnel/relations/personnel-passport.interface';
import {HandleData} from '../../../shared/services/handle-data';
import IScientificInst from '../../../../../server/components/personnel/relations/personnel-scientific-inst.interface';
import * as _ from 'lodash/core';

@Component({
  selector: 'staff-education',
  templateUrl: './education-edit.component.html'
})
export class EducationEditComponent implements OnInit {
  id: string;
  worker = new IPersonnel();
  private datePropsInst: (keyof IInstitution)[] = ['endDate'];
  private datePropsScientificInst: (keyof IScientificInst)[] = ['endDate'];

  constructor(protected http: HttpService, protected route: ActivatedRoute) {
    this.worker.scientificInst = new IScientificInst(null);
  }

  async ngOnInit() {
    const worker = await this.http.get(`personnel/${this.route.parent.snapshot.params.id}/edu`).toPromise();
    this.handlePersAfterGet(worker);
  }

  handlePersAfterGet(worker: IPersonnel) {
    if (!_.isEmpty(worker.scientificInst)) {
      worker.scientificInst = HandleData.handleDatesInObjectFromServer(worker.scientificInst, this.datePropsScientificInst);
    } else {
      worker.scientificInst = new IScientificInst(null);
    }
    if (!_.isEmpty(worker.institutions)) {
      worker.institutions = HandleData.handleDatesInArrFromServer(worker.institutions, this.datePropsInst);
    }
    this.worker = worker;
  }
  addInst() {
    this.worker.institutions.push(new IInstitution(+this.id));
  }

  deleteInst(i) {
    this.worker.institutions.splice(i, 1);
  }

  save() {
    const worker = HandleData.copy(this.worker);
    worker.scientificInst = HandleData.handleDatesInObjectToServer(worker.scientificInst, this.datePropsScientificInst);
    if (!_.isEmpty(worker.institutions)) {
      worker.institutions = HandleData.handleDatesInArrToServer(worker.institutions, this.datePropsInst);
    }
    this.http.put(`personnel/${worker.id}/edu`, worker)
      .toPromise()
      .then((newWorker) => this.handlePersAfterGet(<any>newWorker));
  }
}
