import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, DataType
} from 'sequelize-typescript';
import {ISalaryDict} from "./salary-dict.interface";

@Table({
  tableName: 'dict-salary',
})
export default class SalaryDict extends Model<SalaryDict> implements ISalaryDict {
  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column value: string;
  @Column name: string;
  @Column({type: DataType.DECIMAL}) salary;
}
