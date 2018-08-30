import {AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table, Unique} from 'sequelize-typescript';
import Personnel from '../personnel.model';
import {IPersonnel} from '../personnel.interface';
import IVacation from './personnel-vacation.interface';

@Table({
  tableName: 'vacation'
})
export default class Vacation extends Model<Vacation> implements  IVacation {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @ForeignKey(() => Personnel)
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column type: string;
  @Column workDateFrom: Date;
  @Column workDateTo: Date;
  @Column daysAmount: number;
  @Column dateFrom: Date;
  @Column dateTo: Date;
  @Column reason: string;
}
