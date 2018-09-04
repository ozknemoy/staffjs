import IDoc from '../../../interfaces/doc.interface';

export default class IProfRetraining extends IDoc {
  id: number;
  personnelId:  number;
  startEduDate: Date;
  endEduDate: Date;
  specialty: string;
  reason: string;
}
