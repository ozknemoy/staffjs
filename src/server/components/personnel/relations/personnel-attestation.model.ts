import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {IPersonnel} from "../personnel.interface";
import IAttestation from './personnel-attestation.interface';
import Personnel from "../personnel.model";

@Table({
  tableName: 'attestation'
})
export default class Attestation extends Model<Attestation> implements IAttestation {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column
  @ForeignKey(() => Personnel)
  personnelId:  number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column date: Date;
  @Column resolution: string;
  @Column reason: string;
  @Column docNumber: string;
  /*dummy*/ docName: string;
  @Column docDate: Date;
}
