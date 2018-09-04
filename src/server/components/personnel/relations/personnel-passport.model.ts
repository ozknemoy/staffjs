import {
  Table, Column, Model, PrimaryKey, AutoIncrement, BelongsTo,
  ForeignKey, BeforeUpdate, BeforeCreate, Is, IsEmail, Min
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

  @ForeignKey(() => Personnel)
  @Column
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column birthDate: Date;
  @Column birthPlace: string;
  @Column citizenship: string;
  @Column maritalStatus: string;
  @Column number: string;
  @Column passportIssued: string;
  @Column passportDate: Date;
  @Column address: string;
  @Column passportRegDate: Date;



}
