import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, BelongsToMany, BelongsTo,
  ForeignKey
} from 'sequelize-typescript';
import {IFamily} from "./personnel-family.interface";
import Personnel from "./personnel.model";

@Table({
  tableName: 'family'
})
export default class Family extends Model<Family> implements IFamily {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;


  @ForeignKey(() => Personnel)
  @Column
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: number;

  @Column relationshipDegree: string;
  @Column fullName: string;
  @Column birthYear: string;

}
