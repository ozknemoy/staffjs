import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, DataType, NotEmpty, NotNull, Is, AllowNull
} from 'sequelize-typescript';
import {ISalaryDict} from "./salary-dict.interface";
import {hasValue} from '../../../shared/validators';


@Table({
  tableName: 'dict-salary',
})
export default class SalaryDict extends Model<SalaryDict> implements ISalaryDict {
  /*@AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;*/

  @AllowNull(false)
  @Is('значение', val => hasValue(val, 'Не допускается пустое значение'))
  @Column value: string;

  @AllowNull(false)
  @Is('название', val => hasValue(val, 'Не допускается пустое название'))
  @Column name: string;

  @AllowNull(false)
  @Is('оклад', val => hasValue(val, 'Не допускается пустой оклад'))
  @Column({type: DataType.INTEGER}) salary;
}
