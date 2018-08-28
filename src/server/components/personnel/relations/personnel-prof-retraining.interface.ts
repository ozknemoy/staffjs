import IDoc from '../../../interfaces/doc.interface';

export default class IProfRetraining {
  id: number;
  personnelId:  number;
  startEduDate: string;
  endEduDate: string;
  specialty: string;
  doc: IDoc;
  docId: number;
  reason: string;
}
