import {
  AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table,
  Unique
} from "sequelize-typescript";
import ILaborContract from "./personnel-labor-contract.model";
import Personnel from "../personnel.model";
import {IPersonnel} from "../personnel.interface";

@Table({
  tableName: 'labor-contract'
})
export default class LaborContract extends Model<LaborContract> implements ILaborContract{

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @ForeignKey(() => Personnel)
  @Column personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column number: string;
  @Column({type: DataType.DATE}) date: string;
  @Column({type: DataType.DATE}) endDate: string;
  @Column specialty: string;
  @Column department: string;
  @Column attractionTerms: string;
  @Column soutDate: string;

}
