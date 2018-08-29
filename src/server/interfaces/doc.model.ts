import IDoc from './doc.interface';
import {
  AutoIncrement, BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table,
  Unique
} from 'sequelize-typescript';
import Attestation from '../components/personnel/relations/personnel-attestation.model';
import ProfRetraining from "../components/personnel/relations/personnel-prof-retraining.model";
import QualImprovement from "../components/personnel/relations/personnel-qual-improvement.model";
import Reward from "../components/personnel/relations/personnel-reward.model";
import SocialSecurity from '../components/personnel/relations/personnel-social-security.model';
import IAttestation from '../components/personnel/relations/personnel-attestation.interface';



@Table({
  tableName: 'doc'
})
export default class Doc extends Model<Doc> implements IDoc {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column
  id: number;

  @HasOne(() => Attestation, {as: 'attestationDocId'})
  @HasOne(() => SocialSecurity, {as: 'socialSecurityDocId'})
  @HasOne(() => Reward, {as: 'rewardDocId'})
  @HasOne(() => ProfRetraining, {as: 'profRetrainingDocId'})
  @HasOne(() => QualImprovement, {as: 'qualImprovementDocId'})
  owner;


  @Column number: string;
  @Column name: string;
  @Column date: string;
}
