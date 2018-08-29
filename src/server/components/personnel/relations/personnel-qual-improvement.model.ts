import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, HasOne, BelongsTo,
  DefaultScope
} from 'sequelize-typescript';
import Doc from '../../../interfaces/doc.model';
import IDoc from '../../../interfaces/doc.interface';
import IQualImprovement from './personnel-qual-improvement.interface';
import Personnel from "../personnel.model";
import {IPersonnel} from "../personnel.interface";

@DefaultScope({
  include: [() => Doc]
})
@Table({
  tableName: 'qual-improvement'
})
export default class QualImprovement extends Model<QualImprovement> implements IQualImprovement {

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
  qualImprovementDocId: number;

  @BelongsTo(() => Doc, 'qualImprovementDocId')
  doc: IDoc;

  @Column startEduDate: Date;
  @Column endEduDate: Date;
  @Column type: string;
  @Column institutionName: string;
  @Column reason: string;

}
