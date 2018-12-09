import {IDepartmentDict} from "./department-dict.interface";

export class IFacultyDict {
  id: number = null;
  name: string = null;
  departments: IDepartmentDict[] = null;
}