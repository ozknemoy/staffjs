import * as _ from 'lodash/core';
import Personnel from '../personnel/personnel.model';
import { Document, Paragraph, TextRun } from 'docx';

function setStandartStyles(doc) {
  doc.Styles.createParagraphStyle('10', "10")
    .size(20);
  doc.Styles.createParagraphStyle('12', "12")
    .size(24);
  doc.Styles.createParagraphStyle('9', "9")
    .size(18);
  doc.Styles.createParagraphStyle('7', "7")
    .size(14);
}

export const pageMargins = {
  top: -500,
  right: 500,
  bottom: -100,
  left: 500,
};

export function addEmptyLineUnderlined(withComma = false) {
  return new Paragraph('_________________________________________________________________________________________________________________________________________________' + withComma ? ',' : '');
}

export class PrintLaborContractScientificBuilder2 {
  private doc = new Document({
    creator: "admin",
    title: "PrintLaborContractScientific",
    description: "PrintLaborContractScientific",
  }, pageMargins);

  constructor(private pers: Personnel) {
    setStandartStyles(this.doc)
  }

  make() {
    return this
      .makeHeader()
      .build();
  }

  private makeHeader() {

    const one =
      new Paragraph("Приложение №___").right().style('12')
        .addRun(new TextRun("Утверждено приказом").break())
        .addRun(new TextRun("от __________ №__________").break());
    this.doc.addParagraph(one);

    const header = new Paragraph().center().style('12');
    header.addRun(new TextRun('Трудовой договор №____').bold().break());
    header.addRun(new TextRun('с научным работником').bold().break());
    this.doc.addParagraph(header);

    const four = new Paragraph('Санкт-Петербург                                                                                                                                                            «___»_________20__г.').right().style('9');
    this.doc.addParagraph(four);
    const five = new Paragraph().style('9')
      .addRun(new TextRun('Федеральное государственное автономное образовательное учреждение высшего образования «Санкт-Петербургский   государственный   университет   аэрокосмического   приборостроения»,  в   лице   ректора/проректор').tab().break());
    this.doc.addParagraph(five);
    const underFive = new Paragraph()
      .addRun(new TextRun('(нужное подчеркнуть)').italic().size(14)).spacing({before: 40});
    this.doc.addParagraph(underFive);
    this.doc.addParagraph(addEmptyLineUnderlined());
    const underFio = new Paragraph()
      .center()
      .style('7')
      .addRun(new TextRun('фамилия, имя, отчество').italic());
    this.doc.addParagraph(underFio);








    return this
  }

  private build() {
    return this.doc
  }
}
