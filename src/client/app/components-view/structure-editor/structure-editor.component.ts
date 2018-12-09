import {Component} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ToastrService} from 'ngx-toastr';
import {IFacultyDict} from "../../../../server/components/dict/faculty-dict.interface";
import {IDepartmentDict} from "../../../../server/components/dict/department-dict.interface";

@Component({
  selector: 'structure-editor',
  templateUrl: './structure-editor.component.html'
})
export class StructureEditorComponent {
  public faculties: IFacultyDict[];
  constructor(
    private httpService: HttpService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.httpService.get('dict/faculty').then(faculties => this.faculties = faculties)
  }

  save(i) {
    this.httpService.putWithToast('dict/faculty', this.faculties[i])
      .then(faculty => this.faculties[i] = <any>faculty)
  }

  addFaculty() {
    this.faculties.push(new IFacultyDict())
  }

  addDepartment(i) {
    const department = new IDepartmentDict(this.faculties[i].id);
    if(this.faculties[i].departments) {
      this.faculties[i].departments.push(department);
    } else {
      this.faculties[i].departments = [department];
    }
  }

  async deleteRow(i) {
    // если не вновь созданая строка
    if(this.faculties[i].id) {
      await this.httpService.delete('dict/faculty/' + this.faculties[i].id)
    }
    this.faculties.splice(i, 1)
  }

  async deleteDepartment(i) {
    this.faculties[i].departments.splice(i, 1);
  }
}
