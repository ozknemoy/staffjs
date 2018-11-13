import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, BelongsTo,
  NotEmpty, DataType
} from 'sequelize-typescript';
import Personnel from "../personnel.model";
import {IPersonnel} from "../personnel.interface";
import IAcademicRank from "./academic-rank.interface";

@Table({
  tableName: 'staff-academic-rank'
})
export default class AcademicRank extends Model<AcademicRank> implements IAcademicRank {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @NotEmpty
  @ForeignKey(() => Personnel)
  @Column personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column rank: string;
  @Column specialty: string;
  @Column appointingAuthority: string;
  @Column({type: DataType.DATE}) statementDate: string;
  @Column docNumber: string;
  @Column docName: string;
  @Column({type: DataType.DATE}) docDate;

}
