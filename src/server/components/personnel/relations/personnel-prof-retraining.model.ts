import IDoc from '../../../../shared/interfaces/doc.interface';
import {
  AutoIncrement, BelongsTo, Column, DataType, DefaultScope, ForeignKey, HasOne, Model, PrimaryKey, Table,
  Unique
} from 'sequelize-typescript';
import {IPersonnel} from "../personnel.interface";
import Personnel from "../personnel.model";
import IProfRetraining from './personnel-prof-retraining.interface';


@Table({
  tableName: 'staff-prof-retraining'
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

  @Column({type: DataType.DATE}) startEduDate: string;
  @Column({type: DataType.DATE}) endEduDate: string;
  @Column specialty: string;
  @Column reason: string;
  @Column docNumber: string;
  @Column docName: string;
  @Column({type: DataType.DATE}) docDate: string;
}
