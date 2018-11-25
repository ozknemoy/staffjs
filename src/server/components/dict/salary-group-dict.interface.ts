import {ISalaryDict} from "./salary-dict.interface";


export class ISalaryGroupDict {
  id: number;
  groupId: number;
  group?: ISalaryDict[];
  name: string = null;
  salary: number = null;
}
