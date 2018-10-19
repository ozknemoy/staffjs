import * as _ from 'lodash/core';
import Personnel from '../personnel/personnel.model';
const officegen = require('officegen');

export const docsHeaders = {
  subject: 'subjectsubjectsubject',
  title: 'tiiiiiiiitle'
};

export const redIndent = '           ';

export class PrintLaborContractScientificBuilder {
  private doc;

  constructor(private pers: Personnel) {
    this.doc = officegen(Object.assign({
      type: 'docx',
      pageMargins: { top: 400, left: 1000, bottom: 200, right: 1000 }
    }, docsHeaders))
  }


  make() {
    return this
      .makeHeader()
      .build();
  }

  private makeHeader() {

    const one = this.doc.createP();
    one.options.indentLeft = 2550;
    one.options.align = 'right'; // 'center' 'right' or 'justify'.
    //pObj.options.indentLeft = 1440; // Indent left 1 inch
    one.addText('Приложение №___');
    one.addLineBreak ();
    one.addText('Утверждено приказом');
    one.addLineBreak ();
    one.addText('от __________ №__________');
    one.addLineBreak ();

    const two = this.doc.createP();
    two.options.align = 'center';
    two.addText('Трудовой договор №____', {bold: true});
    two.addLineBreak ();
    two.addText('с научным работником', {bold: true});

    const three = this.doc.createP();
    //three.options.align = 'right';
    three.addText(redIndent + 'Санкт-Петербург                                                                                                             «___»_________20__г.');
    three.addText('');

    const four = this.doc.createP();
    //four.options.indentLeft = 2550;
    four.addText(redIndent + 'Федеральное государственное автономное образовательное учреждение высшего образования «Санкт-Петербургский   государственный   университет   аэрокосмического   приборостроения»,  в   лице   ректора/проректора (нужное подчеркнуть) ');
    four.addText('');


    /*two.addText( ' with color', { color: '000088' } );
    two.addText( ' and back color.', { color: '00ffff', back: '000088' } );
    two.addText( 'Bold + underline', { bold: true, underline: true } );
    two.addText( 'Fonts face only.', { font_face: 'Arial' } );
    two.addText( ' Fonts face and size. ', { font_face: 'Arial', font_size: 40 } );
    two.addText( 'External link', { link: 'https://github.com' } );*/
    return this
  }

  private build() {
    return this.doc
  }
}
