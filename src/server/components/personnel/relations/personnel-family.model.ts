import {
  Table, Column, Model, PrimaryKey, AutoIncrement, BelongsTo,
  ForeignKey, BeforeUpdate, BeforeCreate, Is, IsEmail, Min, NotEmpty
} from 'sequelize-typescript';
import {IFamily} from "./personnel-family.interface";
import Personnel from "../personnel.model";
import {isValidDate, isValidTimeStamp, isValidYear} from "../../../helpers/is-valid-date";

@Table({
  tableName: 'staff-family'
})
export default class Family extends Model<Family> implements IFamily {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;


  @ForeignKey(() => Personnel)
  @NotEmpty
  @Column
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: number;

  @Column relationshipDegree: string;
  @Column fullName: string;

  @Min(1900)
  @Is('year', (date) => {
    isValidYear(date, 'Год рождения не валиден')
  })
  @Column
  birthYear: number;

  /*@BeforeUpdate
  @BeforeCreate
  static beforeSave(instance: IFamily) {
    console.log(instance);
    instance = handleDates(instance, ['birthYear'])
  }*/

}
