import {Document, Paragraph, TextRun} from 'docx';
import {getOneOneP, addOneThreeP, makeCommonHeader, makeRequisite} from "./labor-contract-helpers.class";
import {
  addUnderlineText, emptyLine, getEmptyLinePlusText, getTitle, multiTab, pageMargins,
  setStandartStyles
} from "./docx-helpers";
import {IPersonnel} from "../personnel/personnel.interface";
import {HandleData} from "../../../shared/handle-data";
import * as _ from 'lodash'
import {PrintRequisitesBuilder} from "./print-requisites.class";
import IWorkplace from "../personnel/relations/personnel-workplace.interface";

export class PrintLaborContractDynamicBuilder {
  private doc = new Document({
    creator: "admin",
    title: "LaborContract",
    description: "LaborContract",
  }, pageMargins);

  constructor(private pers: IPersonnel) {
    setStandartStyles(this.doc)
  }

  make(): Document[] {
    return this
    .makeHeaderAndSectionOne()
    .makeSectionTwo()
      .makeSectionThree()
      .build();
  }

  private makeHeaderAndSectionOne() {
    const worker = this.pers;
    const workplace: IWorkplace = worker.workplaces[0];
    const contractNumber =  workplace.contractNumber;
    this.doc.addParagraph(getTitle(`Трудовой договор №${contractNumber || '____'}`));
    makeCommonHeader(this.doc, this.pers);
    const sciInstSp = !_.isEmpty(worker.scientificInst)
      ? worker.scientificInst[0].specialty
      : '___________________________________ _______________________________________';
    const academicRank = !_.isEmpty(worker.academicRank)
      ? worker.academicRank.map(ar => ar.rank).filter(ar => !HandleData.isNoValue(ar)).join(', ')
      : '___________________________________';
    const specialty = workplace.specialty || '______________________________________________________________________________________ ';
    const department = new TextRun((workplace.department? getEmptyLinePlusText(workplace.department) : emptyLine) + ',');

    const oneOne = new Paragraph()
      .style('9')
      .addRun(new TextRun('1.1. ').break())
      .addRun(new TextRun('Работодатель').bold())
      .addRun(new TextRun(' обязуется предоставить '))
      .addRun(new TextRun('Работнику').bold())
      .addRun(new TextRun(`, имеющему ученую степень ${sciInstSp || ''} и (или) ученое звание ${academicRank}(заполняется при наличии), работу в должности ${specialty}`))
      .addRun(department.underline().break());
    this.doc.addParagraph(oneOne);
    this.doc.addParagraph(addUnderlineText(2, 'название структурного подразделения').center());
    this.doc.addParagraph(getOneOneP());
    const _oneOne = new Paragraph('Конкретный вид поручаемой Работнику работы, ее содержание и круг трудовых обязанностей определяются должностной инструкцией, являющейся неотъемлемой частью настоящего трудового договора.')
      .style('9');
    this.doc.addParagraph(_oneOne);
    let reason = workplace.reason || workplace.academicCouncilDate ? workplace.reason : `________________________________________________ ${emptyLine}`;

    const oneTwo = new Paragraph(`1.2. Основание для заключения трудового договора: ${reason}.`)
      .style('9');
    this.doc.addParagraph(oneTwo);
    addOneThreeP(this.doc, worker);
    const oneFour = new Paragraph('1.4. Трудовой договор является бессрочным/срочным в соответствии с ч. 2 ст. 59 Трудового кодекса Российской Федерации.')
      .style('9');
    this.doc.addParagraph(oneFour);
    this.doc.addParagraph(addUnderlineText(720 * 4));
    const contractDate =  HandleData.where(worker.workplaces, 'active', true, true).contractDate;
    const oneFourEnd = new Paragraph()
      .style('9')
      .addRun(new TextRun(`Дата начала работы: ${HandleData.getFullDate(contractDate)};`))
      .addRun(new TextRun(`срок действия трудового договора: до  ${HandleData.getFullDate()}`).break());
    this.doc.addParagraph(oneFourEnd);
    const oneFive = new Paragraph()
      .style('9')
      .addRun(new TextRun('1.5. Условия о неразглашении '))
      .addRun(new TextRun('Работником').bold())
      .addRun(new TextRun(' охраняемой законом тайны (государственной, служебной, коммерческой)'))
      .addRun(new TextRun(emptyLine).break())
      .addRun(new TextRun(emptyLine).break())
      .addRun(new TextRun(emptyLine).break());
    this.doc.addParagraph(oneFive);
    this.doc.addParagraph(oneFourEnd);
    const oneSix = new Paragraph('1.6. Характер работы ________________________________________________________________________________')
      .style('9');
    this.doc.addParagraph(oneSix);
    const oneSeven = new Paragraph()
      .style('9')
      .addRun(new TextRun(`1.7. Условия труда на рабочем месте на момент заключения настоящего договора - ${workplace.soutClass || '_______________'}. Условия труда на рабочем месте устанавливаются `))
      .addRun(new TextRun('Работнику').bold())
      .addRun(new TextRun(' в соответствии с требованиями законодательства Российской Федерации в сфере охраны труда по результатам специальной оценки условий труда и оформляются приложениями к настоящему трудовому договору. '));
    this.doc.addParagraph(oneSeven);
    return this
  }

  makeSectionTwo() {
    const workplace: IWorkplace = this.pers.workplaces[0];
    this.doc.addParagraph(getTitle('2. Режим рабочего времени и отдыха'));

    const one = new Paragraph()
      .style('9')
      .addRun(new TextRun('2.1. Работнику устанавливается полная/неполная рабочая неделя с продолжительностью рабочего времени «____» часов, ').break())
      .addRun(multiTab(60).italic())
      .addRun(new TextRun(`исходя из нормальной/сокращенной продолжительности рабочего времени «${workplace.duration || '_____'}» часов в неделю.`).break())
      .addRun(multiTab(25).italic())
      .addRun(new TextRun('2.1. Режим рабочего времени и времени отдыха ').break())
      .addRun(new TextRun('Работника'))
      .addRun(new TextRun(' определяется коллективным договором, правилами внутреннего распорядка, иными локальными нормативными актами '))
      .addRun(new TextRun('Университета').bold())
      .addRun(new TextRun(', трудовым договором, графиками работы и расписанием занятий.'))
      .addRun(new TextRun('2.3. ').break())
      .addRun(new TextRun('Работнику').bold())
      .addRun(new TextRun(' предоставляется ежегодный основной оплачиваемый отпуск продолжительностью ________ календарных дней.'))
      .addRun(new TextRun('2.4. ').break())
      .addRun(new TextRun('Работнику').bold())
      .addRun(new TextRun(' не относящемуся к профессорско-преподавательскому составу, предоставляется ежегодный дополнительный оплачиваемый отпуск:'))
      .addRun(new TextRun('\t- за стаж работы в ГУАП пять и более лет продолжительностью, определяемой условиями коллективного договора').break())
      .addRun(new TextRun('\t- за работу с вредными условиями труда «_____» календарных / рабочих дней').break())
      .addRun(new TextRun(emptyLine).break());
    this.doc.addParagraph(one);
    this.doc.addParagraph(addUnderlineText(2, 'указывается основание  и продолжительность отпуска').center());
    const two = new Paragraph()
      .style('9')
      .addRun(new TextRun('2.5. Очередность предоставления оплачиваемых отпусков определяется графиком отпусков, утвержденным ').break())
      .addRun(new TextRun('Работодателем').bold())
      .addRun(new TextRun(' с учетом мнения выборного органа первичной профсоюзной организации.'));
    this.doc.addParagraph(two);
    return this
  }

  makeSectionThree() {
    const workplace: IWorkplace = this.pers.workplaces[0];
    this.doc.addParagraph(getTitle('3. Оплата труда и материальное стимулирование Работника'));
    const salary = workplace.salary || '____________________';
    const all = new Paragraph()
      .style('9')
      .addRun(new TextRun('3.1. За выполнение трудовой функции ').break())
      .addRun(new TextRun('Работнику').bold())
      .addRun(new TextRun(` устанавливается ${workplace.rate ? workplace.rate * 100 : '_______'} % должностного оклада (пропорционально отработанному времени) в размере ${salary} рублей.`))
      .addRun(new TextRun('3.2. ').break())
      .addRun(new TextRun('Выплаты компенсационного характера:').underline())
      .addRun(new TextRun('- выплаты работникам, занятым на тяжелых работах, работах с вредными и (или) опасными  и иными особыми условиями труда, выплаты за работу в условиях, отклоняющихся от нормальных - оформляются отдельным соглашением к Трудовому договору;').break())
      .addRun(new TextRun('- надбавки за работу со сведениями, составляющими государственную тайну, их засекречиванием и рассекречиванием, а также за работу с шифрами, - в размере _____________________________ рублей.').break())
      .addRun(new TextRun('- иные выплаты компенсационного характера: ____________________________________________________________________ ____________________________________________________________________________________________________________.').break())
      .addRun(new TextRun('3.3. Выплаты стимулирующего  характера:').break())
      .addRun(new TextRun('3.3.1. За качество выполняемых работ: за наличие _________________________________________________________________').break())
      .addRun(multiTab(115, 9, 'ведомственных наград, премии Правительства РФ,'))
      .addRun(new TextRun(emptyLine).break())
      .addRun(multiTab(20, 9, 'премии Правительства Санкт-Петербурга, почетного звания, звания «Заслуженный профессор ГУАП»'))
      .addRun(new TextRun(`- в размере ${this.pers.rewards && this.pers.rewards.length ? 20 : '__________'}% от должностного оклада.`).break());
    this.doc.addParagraph(all);
    return this
  }

  private build() {
    return [this.doc, new PrintRequisitesBuilder(this.pers).make()]
  }
}
