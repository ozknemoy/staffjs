import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, HasOne, BelongsTo} from 'sequelize-typescript';
import {IStaff} from "../personnel.interface";
import IWorkplace from './personnel-workplace.interface';
import IAttestation from './personnel-attestation.interface';
import Doc from '../../../interfaces/doc.model';
import IDoc from '../../../interfaces/doc.interface';

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

  @Column
  @ForeignKey(() => Doc)
  docId: number;

  @HasOne(() => Doc)
  doc: IDoc;

  @Column date: string;
  @Column resolution: string;
  @Column reason: string;

}
