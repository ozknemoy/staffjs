import {Component} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ToastrService} from 'ngx-toastr';
import {ISalaryDict} from "../../../../server/components/dict/salary-dict.interface";
import {ISalaryGroupDict} from "../../../../server/components/dict/salary-group-dict.interface";

@Component({
  selector: 'salary-editor',
  templateUrl: './salary-editor.component.html'
})
export class SalaryEditorComponent {
  public salaries: ISalaryGroupDict[];
  constructor(
    private httpService: HttpService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.httpService.get('dict/salaries').then(salaries => this.salaries)
  }

  save() {

  }

  addRow() {

  }

  deleteRow() {

  }
}
