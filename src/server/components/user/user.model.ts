import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement} from 'sequelize-typescript';
import IUser from './user.interface';

@Table({
  tableName: 'army'
})
export default class User extends Model<User> implements IUser {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column login: string;
  @Column rights: number;
  @Column password: string;

}
