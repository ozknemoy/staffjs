import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../services/http.service';
import IInstitution from '../../../../../server/components/personnel/relations/personnel-institution.interface';
import {IPersonnel} from '../../../../../server/components/personnel/personnel.interface';
import {HandleData} from '../../../shared/services/handle-data';
import IScientificInst from '../../../../../server/components/personnel/relations/personnel-scientific-inst.interface';
import * as _ from 'lodash/core';
import {eduTypesDict} from "../../../../../shared/dictionaries/edu-type.dict";
import IAcademicRank from "../../../../../server/components/personnel/relations/academic-rank.interface";

@Component({
  selector: 'staff-education',
  templateUrl: './education-edit.component.html'
})
export class EducationEditComponent implements OnInit {
  id: string;
  worker = new IPersonnel();
  eduTypesDict = eduTypesDict;
  private datePropsInst: (keyof IInstitution)[] = ['endDate'];
  private datePropsScientificInst: (keyof IScientificInst)[] = ['endDate', 'statementDate'];
  private datePropsAcademicRank: (keyof IAcademicRank)[] = ['docDate', 'statementDate'];
  private dateProps: (keyof IPersonnel)[] = ['contractDate', 'workExpDate', 'membershipGANDate', 'membershipOANDate', 'medicalCertDate', 'psychoCertDate',];

  constructor(protected http: HttpService, protected route: ActivatedRoute) {

  }

  async ngOnInit() {
    const worker = await this.http.get(`personnel/${this.route.parent.snapshot.params.id}/edu`);
    this.handlePersAfterGet(worker);
  }

  handlePersAfterGet(worker: IPersonnel) {
    this.worker = HandleData.handleDatesInObjectFromServer(worker, this.dateProps);
    if (!_.isEmpty(worker.institutions)) {
      worker.institutions = HandleData.handleDatesInArrFromServer(worker.institutions, this.datePropsInst);
    }
    if (!_.isEmpty(worker.scientificInst)) {
      worker.scientificInst = HandleData.handleDatesInArrFromServer(worker.scientificInst, this.datePropsScientificInst);
    }
    if (!_.isEmpty(worker.academicRank)) {
      worker.academicRank = HandleData.handleDatesInArrFromServer(worker.academicRank, this.datePropsAcademicRank);
    }
    this.worker = worker;
  }

  addInst() {
    this.worker.institutions.push(new IInstitution(+this.id));
  }

  deleteInst(i) {
    this.worker.institutions.splice(i, 1);
  }

  addScientificInst() {
    this.worker.scientificInst.push(new IScientificInst(+this.id));
  }

  deleteScientificInst(i) {
    this.worker.scientificInst.splice(i, 1);
  }

  addAcademicRank() {
    this.worker.academicRank.push(new IAcademicRank(+this.id));
  }

  deleteAcademicRank(i) {
    this.worker.academicRank.splice(i, 1);
  }

  save() {
    const worker = HandleData.copy(this.worker);
    if (!_.isEmpty(worker.institutions)) {
      worker.institutions = HandleData.handleDatesInArrToServer(worker.institutions, this.datePropsInst);
    }
    if (!_.isEmpty(worker.academicRank)) {
      worker.academicRank = HandleData.handleDatesInArrToServer(worker.academicRank, this.datePropsAcademicRank);
    }
    if (!_.isEmpty(worker.scientificInst)) {
      worker.scientificInst = HandleData.handleDatesInArrToServer(worker.scientificInst, this.datePropsScientificInst);
    }
    this.http.putWithToast(`personnel/${worker.id}/edu`, worker)
      .then((newWorker) => this.handlePersAfterGet(<any>newWorker));
  }
}
