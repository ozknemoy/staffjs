import {
  Table, Column, Model, PrimaryKey, Unique, AutoIncrement, HasMany, HasOne,
  DefaultScope, Is, DataType, Default, NotEmpty
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
import WorkExp from './relations/personnel-work-exp.model';
import IScientificInst from './relations/personnel-scientific-inst.interface';
import ScientificInst from './relations/personnel-scientific-inst.model';
import {phoneRegExp, validateINN} from '../../../shared/validators';
import AcademicRank from "./relations/academic-rank.model";
import IAcademicRank from "./relations/academic-rank.interface";


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

  @Is('inn', validateINN)
  @Column
  inn: string;
  @Column insurance: string;
  @Column workNature: string;
  @Column sex: string;

  @NotEmpty({msg: 'Не допускается пустое имя'})
  @Column name: string;
  @NotEmpty({msg: 'Не допускается пустая фамилия'})
  @Column surname: string;
  @Column middleName: string;
  @Column foreignLanguage: string;
  @Column foreignLanguageGrade: string;
  @Column educationName: string;
  @Column afterInstEduName: string;

  @Column profession: string;

  /*@Is('phone', (value: string) => {
    if (!phoneRegExp.test(value)) {
      throw new Error(`Вы ввели не валидный телефон "${value}". Введите 11-13 цифр, например 12345678901`);
    }
  })*/
  @Column phone: string;
  @Column({type: DataType.DATE}) workExpDate: string;
  @Column workHistoryFileUrl: string;
  @Column medicalCert: boolean;
  @Column membershipGAN: boolean;
  @Column({type: DataType.DATE}) membershipGANDate;
  @Column membershipOAN: boolean;
  @Column({type: DataType.DATE}) membershipOANDate;
  @Column({type: DataType.DATE}) medicalCertDate;
  @Column psychoCert: boolean;
  @Column({type: DataType.DATE}) psychoCertDate;
  @Column convictionCert: boolean;
  @Column disabilityDegree: string;
  @Default(true)
  @Column active: boolean;

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

  @HasMany(() => WorkExp)
  workExp: WorkExp[];

  @HasMany(() => ScientificInst)
  scientificInst: IScientificInst[];

  @HasMany(() => AcademicRank)
  academicRank: IAcademicRank[];
}
