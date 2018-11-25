import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, HasMany, HasOne,
  DefaultScope, Is, DataType, Default, NotEmpty, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import {ISalaryDict} from "./salary-dict.interface";
import SalaryGroupDict from "./salary-group-dict.model";



@Table({
  tableName: 'dict-salary',
})
export default class SalaryDict extends Model<SalaryDict> implements ISalaryDict {
  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;


  @ForeignKey(() => SalaryGroupDict)
  @Column parentGroupId: number;
  @BelongsTo(() => SalaryGroupDict/*, 'groupId'*/)
  parentGroup;

  @Column name: string;
  @Column({type: DataType.DECIMAL}) coef: number;
}
