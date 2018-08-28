import IDoc from '../../../interfaces/doc.interface';


export default class IAttestation  {
  id: number;
  personnelId:  number;
  date: string;
  doc: IDoc;
  resolution: string;
  reason: string;
}
