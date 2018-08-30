import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, HasMany, HasOne,
  DefaultScope
} from 'sequelize-typescript';
import {IPersonnel} from "./personnel.interface";
import Family from "./relations/personnel-family.model";
import Passport from "./relations/personnel-passport.model";
import {IPassport} from "./relations/personnel-passport.interface";
import {IFamily} from "./relations/personnel-family.interface";
import IProfRetraining from "./relations/personnel-prof-retraining.interface";
import ProfRetraining from "./relations/personnel-prof-retraining.model";
import Attestation from "./relations/personnel-attestation.model";
import IAttestation from "./relations/personnel-attestation.interface";
import QualImprovement from "./relations/personnel-qual-improvement.model";
import IQualImprovement from "./relations/personnel-qual-improvement.interface";
import {IPersonnelNamedThingWithDoc} from "./relations/personnel-named-thing-with-doc.interface";
import {ISocialSecurity} from "./relations/personnel-social-security.interface";
import Reward from './relations/personnel-reward.model';
import SocialSecurity from './relations/personnel-social-security.model';

@Table({
  tableName: 'staff'
})
export default class Personnel extends Model<Personnel> implements IPersonnel {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column number: string;
  @Column name: string;
  @Column surname: string;
  @Column middleName: string;
  @Column inn: string;
  @Column insurance: string;



  // в самом конце анкеты
  @Column extraInfo: string;


  @HasMany(() => Attestation)
  attestations: IAttestation[];

  @HasOne(() => Passport)
  passport: IPassport;

  @HasMany(() => Family)
  families: IFamily[];

  @HasMany(() => ProfRetraining)
  profRetrainings: IProfRetraining[];

  @HasMany(() => QualImprovement)
  qualificationImprovements: IQualImprovement[];

  @HasMany(() => Reward)
  rewards: IPersonnelNamedThingWithDoc[];

  @HasMany(() => SocialSecurity)
  socialSecurities: ISocialSecurity[];

}
