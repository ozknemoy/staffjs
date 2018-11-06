import IDoc from '../../../interfaces/doc.interface';


export default class IAttestation extends IDoc  {
  id: number;
  personnelId:  number;
  date: string;
  resolution: string;
  reason: string;
}
