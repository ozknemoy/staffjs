import {
  AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, NotEmpty, PrimaryKey, Table,
  Unique
} from 'sequelize-typescript';
import Personnel from '../personnel.model';
import {IPersonnel} from '../personnel.interface';
import IVacation from './personnel-vacation.interface';

@Table({
  tableName: 'staff-vacation'
})
export default class Vacation extends Model<Vacation> implements  IVacation {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @NotEmpty
  @ForeignKey(() => Personnel)
  @Column personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column type: string;
  @Column({type: DataType.DATE}) workDateFrom: string;
  @Column({type: DataType.DATE}) workDateTo: string;
  @Column daysAmount: number;
  @Column({type: DataType.DATE}) dateFrom: string;
  @Column({type: DataType.DATE}) dateTo: string;
  @Column reason: string;
}
