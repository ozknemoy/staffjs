import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, BelongsTo,
  DataType, NotEmpty
} from 'sequelize-typescript';
import IWorkplace from './personnel-workplace.interface';
import Personnel from "../personnel.model";
import {IPersonnel} from "../personnel.interface";

@Table({
  tableName: 'staff-workplace'
})
export default class Workplace extends Model<Workplace> implements IWorkplace {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @NotEmpty
  @ForeignKey(() => Personnel)
  @Column personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column({type: DataType.DATE}) date: string;
  @Column department: string;
  @Column specialty: string;
  @Column salary: number;
  @Column reason: string;
  @Column({type: DataType.DATE}) academicCouncilDate: string;
  @Column attractionTerms: string;
  @Column rate: number;
  @Column duration: number;
  @Column category: string;
  @Column({type: DataType.DATE}) dismissalDate: string;
  @Column dismissalGround: string;
  @Column dismissalReason: string;
  @Column lawArticle: string;

}
