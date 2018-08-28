import IDoc from './doc.interface';
import {
  AutoIncrement, BelongsTo, BelongsToMany, Column, ForeignKey, Model, PrimaryKey, Table,
  Unique
} from 'sequelize-typescript';
import Attestation from '../components/personnel/relations/personnel-attestation.model';
import ProfRetraining from "../components/personnel/relations/personnel-prof-retraining.model";
import QualificationImprovement from "../components/personnel/relations/personnel-qual-improvement.model";
import Reward from "../components/personnel/relations/personnel-reward.model";

const _docRels = {as: 'ownerId'};

@Table({
  tableName: 'doc'
})
export default class Doc extends Model<Doc> implements IDoc {
  /*@BelongsToMany(
    () => Attestation,
    () => Reward,
    () => ProfRetraining,
    () => QualificationImprovement)*/
  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column
  id: number;

  @Column docNumber: string;
  @Column docName: string;
  @Column docDate: string;
}
