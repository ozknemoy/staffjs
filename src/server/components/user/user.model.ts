import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement} from 'sequelize-typescript';
import IUser from './user.interface';

@Table({
  tableName: 'user'
})
export default class User extends Model<User> implements IUser {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Unique
  @Column login: string;
  @Column rights: number;
  @Column password: string;

}
