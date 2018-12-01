import {Component} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ToastrService} from 'ngx-toastr';
import {ISalaryDict} from "../../../../server/components/dict/salary-dict.interface";

@Component({
  selector: 'salary-editor',
  templateUrl: './salary-editor.component.html'
})
export class SalaryEditorComponent {
  public salaries: ISalaryDict[];
  constructor(
    private httpService: HttpService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.httpService.get('dict/salary').then(salaries => this.salaries = salaries)
  }

  save(i) {
    this.httpService.putWithToast('dict/salary', this.salaries[i])
      .then(salary => this.salaries[i] = <any>salary)
  }

  addRow() {
    this.salaries.push(new ISalaryDict())
  }

  async deleteRow(i) {
    // если не вновь созданая строка
    if(this.salaries[i].id) {
      await this.httpService.delete('dict/salary/' + this.salaries[i].id)
    }
    this.salaries.splice(i, 1)
  }
}
