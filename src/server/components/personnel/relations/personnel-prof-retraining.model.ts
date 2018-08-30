import IDoc from '../../../interfaces/doc.interface';
import {AutoIncrement, BelongsTo, Column, DefaultScope, ForeignKey, HasOne, Model, PrimaryKey, Table, Unique} from 'sequelize-typescript';
import {IPersonnel} from "../personnel.interface";
import Personnel from "../personnel.model";
import IProfRetraining from './personnel-prof-retraining.interface';


@Table({
  tableName: 'prof-retraining'
})
export default class ProfRetraining extends Model<ProfRetraining> implements IProfRetraining {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Personnel)
  @Column
  personnelId:  number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column startEduDate: string;
  @Column endEduDate: string;
  @Column specialty: string;
  @Column reason: string;
  @Column docNumber: string;
  @Column docName: string;
  @Column docDate: string;
}