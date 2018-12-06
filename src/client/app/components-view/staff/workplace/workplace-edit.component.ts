import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {HandleData, ISimpleObj} from '../../../../../shared/handle-data';
import IWorkplace from '../../../../../server/components/personnel/relations/personnel-workplace.interface';
import {attractionTermsDict} from "../../../../../shared/dictionaries/attraction-terms.dict";
import * as _ from 'lodash';
import {ISalaryDict} from '../../../../../server/components/dict/salary-dict.interface';
import {ToastrService} from "ngx-toastr";
import {ILaborContractDocx} from "../../../../../server/components/print/labor-contract-docx.interface";
@Component({
  selector: 'staff-workplace',
  templateUrl: './workplace-edit.component.html'
})
export class WorkplaceComponent implements OnInit {
  public salaries: {[key: string]: number};
  id: string;
  public attractionTermsDict = attractionTermsDict;
  public staffCategoriesDict: ISalaryDict[];
  private dateProps: (keyof IWorkplace)[] = ['date', 'dismissalDate', 'academicCouncilDate', 'dismissalDate', 'contractDate', 'contractEndDate', 'soutDate'];
  public workplaces: IWorkplace[] = [];
  contracts: ILaborContractDocx[];
  selectedWorkplaceId: number;
  constructor(private http: HttpService, private route: ActivatedRoute, private toast: ToastrService) { }

  async ngOnInit() {
    this.id = this.route.snapshot.parent.params.id;
    this.staffCategoriesDict = await this.http.getStaffCategoriesDict();
    this.salaries = HandleData.toKeyProp<ISalaryDict, number>(this.staffCategoriesDict, 'value', 'salary');
    this.http.get(`/personnel/${this.id}/workplace`)
      .then((workplaces: IWorkplace[]) => this.afterRetrieving(workplaces));

    this.http.get('print/labor-contract/all').then((contracts) => {
      this.contracts = contracts;
    })

  }

  onCategoryChange(w: IWorkplace) {
    const msgChunk = 'Обратите внимание что тарифная ставка удалилась и теперь запрещена для ввода';
    if(this.salaries[w.category] === 0) {
      w.salaryCoef = null;
      this.toast.info('Выбрана базовая категорию, а надо выбрать ее подкатегорию. ' + msgChunk)
    }
    if(w.category === null) {
      w.salaryCoef = null;
      this.toast.info('Вы удалили категорию. ' + msgChunk)
    }
  }

  afterRetrieving(workplaces) {
    this.workplaces = _.orderBy(
      HandleData.handleDatesInArrFromServer(workplaces, this.dateProps),
      ['id'],
      ['desc']
    )
  }

  addRow() {
    this.selectedWorkplaceId = null;
    this.workplaces.unshift(new IWorkplace(null))
  }

  deleteRow(i) {
    this.workplaces.splice(i, 1)
  }

  save() {
    const tbl = HandleData.handleDatesInArrToServer(this.workplaces, this.dateProps);
    this.http.putWithToast(`/personnel/${this.id}/workplace`, tbl)
      .then((workplaces: IWorkplace[]) => this.afterRetrieving(<any>workplaces))
  }

}
