import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, BelongsTo} from 'sequelize-typescript';
import IWorkplace from './personnel-workplace.interface';
import Personnel from "../personnel.model";
import {IPersonnel} from "../personnel.interface";

@Table({
  tableName: 'workplace'
})
export default class Workplace extends Model<Workplace> implements IWorkplace {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column
  @ForeignKey(() => Personnel)
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column date: string;
  @Column department: string;
  @Column specialty: string;
  @Column salary: string;
  @Column reason: string;


}