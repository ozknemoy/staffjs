import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, HasMany, HasOne,
  DefaultScope, Is, DataType, Default, NotEmpty, ForeignKey
} from 'sequelize-typescript';
import {ISalaryGroupDict} from "./salary-group-dict.interface";
import SalaryDict from "./salary-dict.model";
import {ISalaryDict} from "./salary-dict.interface";



@Table({
  tableName: 'dict-salary-group',
})
export default class SalaryGroupDict extends Model<SalaryGroupDict> implements ISalaryGroupDict {
  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column groupId: number;
  @HasMany(() => SalaryDict/*, 'groupId'*/ )
  group: ISalaryDict[];

  @Column name: string;
  @Column({type: DataType.DECIMAL}) salary: number;
}
