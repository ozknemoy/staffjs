import {Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, HasOne, BelongsTo} from 'sequelize-typescript';
import Doc from '../../../interfaces/doc.model';
import IDoc from '../../../interfaces/doc.interface';
import Personnel from "../personnel.model";
import {IPersonnel} from "../personnel.interface";
import {IPersonnelNamedThingWithDoc} from "./personnel-named-thing-with-doc.interface";


export default class PersonnelNamedThingWithDoc extends Model<PersonnelNamedThingWithDoc> implements IPersonnelNamedThingWithDoc {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column
  @ForeignKey(() => Personnel)
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column
  @ForeignKey(() => Doc)
  docId: number;

  @HasOne(() => Doc, 'docId')
  doc: IDoc;

  @Column name: string;

}
