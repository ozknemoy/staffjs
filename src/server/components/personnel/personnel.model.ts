import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement, HasMany, HasOne} from 'sequelize-typescript';
import {IPersonnel} from "./personnel.interface";
import Family from "./relations/personnel-family.model";
import Passport from "./relations/personnel-passport.model";
import {IPassport} from "./relations/personnel-passport.interface";
import {IFamily} from "./relations/personnel-family.interface";
import IProfessionalRetraining, {default as IProfRetraining} from "./relations/personnel-prof-retraining.interface";
import ProfessionalRetraining, {default as ProfRetraining} from "./relations/personnel-prof-retraining.model";
import Attestation from "./relations/personnel-attestation.model";
import IAttestation from "./relations/personnel-attestation.interface";
import QualificationImprovement from "./relations/personnel-qual-improvement.model";
import IQualificationImprovement from "./relations/personnel-qual-improvement.interface";
import Reward, {default as SocialSecurity} from "./relations/personnel-social-security.model";
import {IPersonnelNamedThingWithDoc} from "./relations/personnel-named-thing-with-doc.interface";
import {ISocialSecurity} from "./relations/personnel-social-security.interface";

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
  @Column inn: string;
  @Column insurance: string;



  @HasMany(() => Attestation)
  attestations: IAttestation[];

  @HasMany(() => Family)
  families: IFamily[];

  @HasOne(() => Passport)
  passport: IPassport;

  @HasMany(() => ProfRetraining)
  profRetrainings: IProfRetraining[];

  @HasMany(() => QualificationImprovement)
  qualificationImprovements: IQualificationImprovement[];

  @HasMany(() => Reward)
  rewards: IPersonnelNamedThingWithDoc[];

  @HasMany(() => SocialSecurity)
  socialSecurities: ISocialSecurity[];

}
