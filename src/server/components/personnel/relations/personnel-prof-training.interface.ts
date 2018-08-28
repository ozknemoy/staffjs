import IDoc from '../../../interfaces/doc.interface';

export default class IProfessionalRetraining {
  id: number;
  personnelId:  number;
  startEduDate: string;
  endEduDate: string;
  specialty: string;
  doc: IDoc;
  reason: string;
}
