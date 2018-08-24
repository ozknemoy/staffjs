import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, HasOne, BelongsTo} from 'sequelize-typescript';
import Doc from '../../../interfaces/doc.model';
import IDoc from '../../../interfaces/doc.interface';
import IQualificationImprovement from './personnel-qual-improvement.interface';

@Table({
  tableName: 'qualification-improvement'
})
export default class QualificationImprovement extends Model<QualificationImprovement> implements IQualificationImprovement {

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

  @Column startEduDate: string;
  @Column endEduDate: string;
  @Column type: string;
  @Column institutionName: string;
  @Column reason: string;

}
