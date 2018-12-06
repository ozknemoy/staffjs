import {Document, Paragraph, TextRun} from 'docx/build';
import {makeCommonHeader, makeRequisite} from "./labor-contract-helpers.class";
import {getTitle, pageMargins, setStandartStyles} from "./docx-helpers";
import {IPersonnel} from '../personnel/personnel.interface';
import {HandleData} from '../../../shared/handle-data';
import {salaryDict} from '../../../shared/dictionaries/salary.dict';
import {ISalaryDict} from "../dict/salary-dict.interface";

export class PrintExtraLaborContractBuilder {
  private doc = new Document({
    creator: "admin",
    title: "доп соглашение",
    description: "ExtraLaborContractDynamicBuilder",
  }, pageMargins);
  private activeWorkplace: IPersonnel['workplaces'][0];

  constructor(private salaries: ISalaryDict[]) {
    setStandartStyles(this.doc)
  }

  make(worker: IPersonnel): Document {
    return this.makeDoc(worker, false);
  }

  makeMoreThanOne(workers: IPersonnel[]): Document {
    workers.forEach(worker => this.makeDoc(worker, true));

    return this.doc
  }

  private makeDoc(worker: IPersonnel, breakPage: boolean) {
    HandleData.addCountedSalary(worker, this.salaries);
    this.activeWorkplace = <IPersonnel['workplaces'][0]>HandleData.where(worker.workplaces, 'active', true, true);
    // именно после this.activeWorkplace
    // ставлю звездочку что данных не хватает
    let dummy = '';
    if(this.someFieldsDoNotExist(worker)) {
      dummy = '*';
    }
    // такая констукция жрет лишнюю строчку но pageBreakBefore надо ставить именно на первом параграфе
    const dummyP = new Paragraph(dummy).right().style('8');
    if(breakPage) {
      dummyP.pageBreakBefore()
    }
    this.doc.addParagraph(dummyP);
    const title = getTitle(`Дополнительное соглашение к Трудовому договору от ${HandleData.getRuDate(this.activeWorkplace.contractDate) || '____________'}    № ${this.activeWorkplace.contractNumber || '____'}`);
    this.doc.addParagraph(title);
    makeCommonHeader(this.doc, worker);

    const one = new Paragraph()
      .style('9')
      .addRun(new TextRun('1.').bold())
      .addRun(new TextRun('\tЗа выполнение трудовой функции '))
      .addRun(new TextRun('Работнику').bold())
      .addRun(new TextRun(` устанавливается ${this.activeWorkplace.rate ? this.activeWorkplace.rate * 100 : '_______'} % должностного оклада (пропорционально отработанному времени) в размере ${this.activeWorkplace.salary || '____________________'} рублей.`))
      .addRun(new TextRun('2.').break().bold())
      .addRun(new TextRun('\tОстальные условия Трудового договора остаются неизменными и Стороны подтверждают свои обязательства.'))
      .addRun(new TextRun('3.').break().bold())
      .addRun(new TextRun('\tНастоящее дополнительное соглашение вступает в силу с момента его подписания Сторонами.'));

    this.doc.addParagraph(one);
    makeRequisite(this.doc, worker);
    return this.doc
  }

  someFieldsDoNotExist(worker: IPersonnel): boolean {
    return [
      this.activeWorkplace.contractDate,
      this.activeWorkplace.contractNumber,
      worker.surname,
      worker.name,
      this.activeWorkplace.rate,
      this.activeWorkplace.salary,
      worker.passport,
      worker.passport.birthDate,
      worker.passport.birthPlace,
      worker.passport.address,
      worker.passport.number,
      worker.passport.passportIssued
    ].some(v => HandleData.isNoValuePrimitive(v))
  }

}
