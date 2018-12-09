import {IFacultyDict} from "../../server/components/dict/faculty-dict.interface";
import {IDepartmentDict} from "../../server/components/dict/department-dict.interface";

export const facultyDict: IFacultyDict[] = [
  {name: 'первый', id: undefined, departments: undefined},
  {name: 'второй', id: undefined, departments: undefined},
];

export const departmentDict: IDepartmentDict[] = [
  {name: 'кафедра 55', facultyId: 1, id: undefined},
  {name: 'кафедра 76', facultyId: 1, id: undefined},
];
