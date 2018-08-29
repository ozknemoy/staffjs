import IDoc from '../../../interfaces/doc.interface';
import {BelongsTo, Column, DefaultScope, ForeignKey, HasOne, Model, Table} from 'sequelize-typescript';
import Doc from '../../../interfaces/doc.model';
import {IPersonnel} from "../personnel.interface";
import Personnel from "../personnel.model";
import IProfRetraining from './personnel-prof-retraining.interface';

@DefaultScope({
  include: [() => Doc]
})
@Table({
  tableName: 'prof-retraining'
})
export default class ProfRetraining extends Model<ProfRetraining> implements IProfRetraining {
  id: number;

  @ForeignKey(() => Personnel)
  @Column
  personnelId:  number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @ForeignKey(() => Doc)
  @Column
  profRetrainingDocId: number;

  @BelongsTo(() => Doc, 'profRetrainingDocId')// второй параметр обязателен
  doc: IDoc;

  startEduDate: string;
  endEduDate: string;
  specialty: string;
  reason: string;
}
