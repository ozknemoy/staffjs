import {
  Table, Column, Model, PrimaryKey, AutoIncrement, BelongsTo,
  ForeignKey, BeforeUpdate, BeforeCreate, Is, IsEmail, Min, NotEmpty, DataType
} from 'sequelize-typescript';
import Personnel from '../personnel.model';
import {IPassport} from './personnel-passport.interface';
import {IPersonnel} from '../personnel.interface';

@Table({
  tableName: 'passport'
})
export default class Passport extends Model<Passport> implements IPassport {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @NotEmpty
  @ForeignKey(() => Personnel)
  @Column
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column({type: DataType.DATE}) birthDate;
  @Column birthPlace: string;
  @Column citizenship: string;
  @Column maritalStatus: string;
  @Column number: string;
  @Column passportIssued: string;
  @Column({type: DataType.DATE}) passportDate;
  @Column address: string;
  @Column addressFact: string;
  @Column({type: DataType.DATE}) passportRegDate;



}
