import IDoc from './doc.interface';
import {BelongsTo, ForeignKey, Model} from 'sequelize-typescript';
import Attestation from '../components/personnel/relations/personnel-attestation.model';
import Workplace from '../components/personnel/relations/personnel-workplace.model';


export default class Doc extends Model<Doc> implements IDoc {


  id: number;

  @ForeignKey()
  @BelongsTo(() => Attestation)
  @BelongsTo(() => Workplace)
  ownerId: number;

  docNumber: string;
  docName: string;
  docDate: string;
}
