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
  @Column salaryCoef: number;
  @Column reason: string;
  @Column({type: DataType.DATE}) academicCouncilDate: string;
  @Column attractionTerms: string;
  @Column({type: DataType.DECIMAL}) rate: number;
  @Column duration: number;
  @Column category: string;
  @Column({type: DataType.DATE}) dismissalDate: string;
  @Column dismissalGround: string;
  @Column lawArticle: string;
  @Column  contractNumber: string;
  @Column({type: DataType.DATE}) contractDate: string;
  @Column({type: DataType.DATE}) contractEndDate: string;
  @Column  terminationReason: string;
  @Column({type: DataType.DATE}) soutDate: string;
  @Column soutClass: string;
  @Column  active: boolean;
}
