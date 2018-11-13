import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, BelongsTo,
  NotEmpty
} from 'sequelize-typescript';
import IWorkplace from './personnel-workplace.interface';
import Personnel from "../personnel.model";
import {IPersonnel} from "../personnel.interface";
import IArmy from './personnel-army.interface';

@Table({
  tableName: 'staff-army'
})
export default class Army extends Model<Army> implements IArmy {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @NotEmpty
  @ForeignKey(() => Personnel)
  @Column personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column reserveCategory: string;
  @Column rank: string;
  @Column profile: string;
  @Column code: string;
  @Column healthCategory: string;
  @Column commissariatName: string;
  @Column militaryAccount: string;
  @Column militaryAccountSpecial: string;
  @Column checkMilitaryAccount: string;


}
