import {AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table, Unique} from 'sequelize-typescript';
import {IPersonnel} from "../personnel.interface";
import Personnel from "../personnel.model";
import IInstitution from "./personnel-institution.interface";


@Table({
  tableName: 'institution'
})
export default class Institution extends Model<Institution> implements IInstitution {

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

  @Column name: string;
  @Column docName: string;
  @Column docCode: string;
  @Column docNumber: string;
  @Column qualification: string;
  @Column specialty: string;
  @Column endDate: number;
}
