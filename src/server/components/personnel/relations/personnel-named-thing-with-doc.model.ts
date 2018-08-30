import {Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, BelongsTo} from 'sequelize-typescript';
import Personnel from "../personnel.model";
import {IPersonnel} from "../personnel.interface";
import {IPersonnelNamedThingWithDoc} from "./personnel-named-thing-with-doc.interface";


export default class PersonnelNamedThingWithDoc extends Model<PersonnelNamedThingWithDoc> implements IPersonnelNamedThingWithDoc {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column
  id: number;

  @Column
  @ForeignKey(() => Personnel)
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column name: string;
  @Column docNumber: string;
  @Column docName: string;
  @Column docDate: string;
}
