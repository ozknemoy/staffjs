
import {IPersonnel} from "../personnel.interface";


export class IPersonnelNamedThingWithDoc {

  id: number;
  personnelId: number;
  personnel: IPersonnel;
  docId: number;
  name: string;

}
