import IDoc from '../../../interfaces/doc.interface';

export default class IQualImprovement extends IDoc {
  id: number;
  personnelId: number = null;
  startEduDate: string = null;
  endEduDate: string = null;
  type: string = null;
  institutionName: string = null;
  reason: string = null;

}
