import IDoc from '../../../interfaces/doc.interface';


export default class IPersonnelNamedThingWithDoc  {
  id: number;
  personnelId:  number;
  name: string;
  doc: IDoc;
}
