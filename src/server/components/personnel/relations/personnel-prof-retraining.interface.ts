import IDoc from '../../../../shared/interfaces/doc.interface';

export default class IProfRetraining extends IDoc {
  id: number;
  personnelId:  number;
  startEduDate: string;
  endEduDate: string;
  specialty: string;
  reason: string;
}
