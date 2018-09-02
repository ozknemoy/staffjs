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
import Vacation from "./relations/personnel-vacation.model";
import IVacation from "./relations/personnel-vacation.interface";
import IInstitution from "./relations/personnel-institution.interface";
import Institution from "./relations/personnel-institution.model";
import Workplace from "./relations/personnel-workplace.model";
import IWorkplace from "./relations/personnel-workplace.interface";

@Table({
  tableName: 'staff',
  timestamps: true
})
export default class Personnel extends Model<Personnel> implements IPersonnel {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;
  @Column number: string;
  @Column inn: string;
  @Column insurance: string;
  @Column alphabet: string;
  @Column workNature: string;
  @Column workType: string;
  @Column sex: string;

  @Column name: string;
  @Column surname: string;
  @Column middleName: string;
  @Column contractNumber: string;
  @Column contractDate: Date;
  @Column foreignLanguage: string;
  @Column foreignLanguageGrade: string;
  @Column educationName: string;

  // в самом конце анкеты
  @Column extraInfo: string;


  @HasMany(() => Attestation)
  attestations: IAttestation[];

  @HasMany(() => Institution)
  institutions: IInstitution[];

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

  @HasMany(() => Vacation)
  vacation: IVacation[];

  @HasMany(() => Workplace)
  workplaces: IWorkplace[];

}
