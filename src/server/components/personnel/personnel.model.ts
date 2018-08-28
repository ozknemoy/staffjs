import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement, HasMany, HasOne} from 'sequelize-typescript';
import {IPersonnel} from "./personnel.interface";
import Family from "./personnel-family.model";
import Passport from "./personnel-passport.model";
import {IPassport} from "./personnel-passport.interface";

@Table({
  tableName: 'staff'
})
export default class Personnel extends Model<Personnel> implements IPersonnel {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @HasMany(() => Family)
  family: Family[];

  @Column number: string;
  @Column name: string;
  @Column inn: string;
  @Column insurance: string;
  // passport
  @HasOne(() => Passport)
  passport: IPassport;
}
