import IDoc from '../../../interfaces/doc.interface';
import {BelongsTo, Column, ForeignKey, HasOne, Model} from 'sequelize-typescript';
import IProfessionalRetraining from './personnel-prof-training.interface';
import Doc from '../../../interfaces/doc.model';

export default class ProfessionalRetraining extends Model<ProfessionalRetraining> implements IProfessionalRetraining {
  id: number;

  @Column
  @ForeignKey(() => Personnel)
  personnelId:  number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column
  @ForeignKey(() => Doc)
  docId: number;

  @HasOne(() => Doc)
  doc: IDoc;

  startEduDate: string;
  endEduDate: string;
  specialty: string;
  reason: string;
}
