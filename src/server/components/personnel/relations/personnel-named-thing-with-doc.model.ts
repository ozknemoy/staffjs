import {
  Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, BelongsTo, DataType,
  NotEmpty
} from 'sequelize-typescript';
import Personnel from "../personnel.model";
import {IPersonnel} from "../personnel.interface";
import {IPersonnelNamedThingWithDoc} from "./personnel-named-thing-with-doc.interface";


export default class PersonnelNamedThingWithDoc extends Model<PersonnelNamedThingWithDoc> implements IPersonnelNamedThingWithDoc {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column
  id: number;

  @NotEmpty
  @Column
  @ForeignKey(() => Personnel)
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column name: string;
  @Column docNumber: string;
  @Column docName: string;
  @Column({type: DataType.DATE}) docDate: string;
}
