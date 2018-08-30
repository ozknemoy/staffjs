
import {IPersonnel} from "../personnel.interface";
import IDoc from '../../../interfaces/doc.interface';

export class IPersonnelNamedThingWithDoc extends IDoc {
  id: number;
  personnelId: number;
  personnel: IPersonnel;
  name: string;
}
