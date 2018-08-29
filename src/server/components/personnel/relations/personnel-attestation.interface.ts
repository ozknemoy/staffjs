import IDoc from '../../../interfaces/doc.interface';


export default class IAttestation  {
  id: number;
  personnelId:  number;
  date: string;
  doc: IDoc;
  docId: number;
  resolution: string;
  reason: string;
}
