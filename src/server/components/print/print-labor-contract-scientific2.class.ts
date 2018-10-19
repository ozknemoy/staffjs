import * as _ from 'lodash/core';
import Personnel from '../personnel/personnel.model';
import * as fs from 'fs';

import { Document, Packer, Paragraph, TextRun } from 'docx';

export const redIndent = '           ';

function setStandartStyles(doc) {
  doc.Styles.createParagraphStyle('10', "10")
    .size(20);
  doc.Styles.createParagraphStyle('12', "12")
    .size(24);
  doc.Styles.createParagraphStyle('9', "9")
    .size(18);
}

export class PrintLaborContractScientificBuilder2 {
  private doc = new Document({
    creator: "admin",
    title: "PrintLaborContractScientific",
    description: "PrintLaborContractScientific",
  }, {
    top: -500,
    right: 500,
    bottom: -100,
    left: 500,
  });

  constructor(private pers: Personnel) {
    setStandartStyles(this.doc)
  }

  make() {
    return this
      .makeHeader()
      .build();
  }

  private makeHeader() {

    const one = new Paragraph("Приложение №___").right().style('12');
    one.addRun(new TextRun("Утверждено приказом").break());
    one.addRun(new TextRun("от __________ №__________").break());
    this.doc.addParagraph(one);

    const header = new Paragraph().center().style('12');
    header.addRun(new TextRun('Трудовой договор №____').bold().break().break());
    header.addRun(new TextRun('с научным работником').bold().break().break());
    this.doc.addParagraph(header);

    const four = new Paragraph('Санкт-Петербург                                                                                                                                                            «___»_________20__г.').right().style('9');
    this.doc.addParagraph(four);
    const five = new Paragraph().style('9');
    five.addRun(new TextRun('Федеральное государственное автономное образовательное учреждение высшего образования «Санкт-Петербургский   государственный   университет   аэрокосмического   приборостроения»,  в   лице   ректора/проректора (нужное подчеркнуть) ').tab().break());
    this.doc.addParagraph(five);



    /*const one = this.doc.createP();
    one.options.indentLeft = 2550;
    one.options.align = 'right';
    one.addText('');
    one.addLineBreak ();
    one.addText('Утверждено приказом');
    one.addLineBreak ();
    one.addText('от __________ №__________');
    one.addLineBreak ();*/
    return this
  }

  private build() {
    return this.doc
  }
}
