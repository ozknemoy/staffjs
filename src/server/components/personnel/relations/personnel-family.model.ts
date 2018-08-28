import {
  Table, Column, Model, PrimaryKey, AutoIncrement, BelongsTo,
  ForeignKey, BeforeUpdate, BeforeCreate, Is, IsEmail, Min
} from 'sequelize-typescript';
import {IFamily} from "./personnel-family.interface";
import Personnel from "../personnel.model";
import {isValidDate, isValidTimeStamp, isValidYear} from "../../../helpers/is-valid-date";

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

  @IsEmail @Column relationshipDegree: string;
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
