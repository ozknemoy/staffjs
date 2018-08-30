import IDoc from '../../../interfaces/doc.interface';
import {extend} from 'sequelize-typescript/lib/utils/object';

export default class IProfRetraining extends IDoc {
  id: number;
  personnelId:  number;
  startEduDate: string;
  endEduDate: string;
  specialty: string;
  reason: string;
}
