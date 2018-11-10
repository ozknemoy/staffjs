import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement,
} from 'sequelize-typescript';
import {ILaborContractDocx} from "./labor-contract-docx.interface";



@Table({
  tableName: 'labor-contract-docx',
  timestamps: true
})
export default class LaborContractDocx extends Model<LaborContractDocx> implements ILaborContractDocx {


  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;
  @Unique
  @Column type: number;
  @Column name: string;
  @Column url: string;

}
