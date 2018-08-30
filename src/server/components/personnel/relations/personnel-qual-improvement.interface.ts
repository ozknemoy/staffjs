import IDoc from '../../../interfaces/doc.interface';

export default class IQualImprovement extends IDoc {
  id: number;
  personnelId: number = null;
  startEduDate: Date = null;
  endEduDate: Date = null;
  type: string = null;
  institutionName: string = null;
  reason: string = null;

}
