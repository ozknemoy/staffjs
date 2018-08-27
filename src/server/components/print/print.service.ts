import {Component} from "@nestjs/common";
import {PersonnelService} from "../personnel/personnel.service";
const path = require('path');

const fontDescriptors = {
  Roboto: {
    normal: path.join(__dirname, '../../fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../../fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '../../fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '../../fonts/Roboto-MediumItalic.ttf')
  }
};
const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fontDescriptors);

const docDefinition = {
  content: 'This is an sample PDF printed with pdfMake'
};

@Component()
export class PrintService {

  constructor(private personnelService: PersonnelService) {

  }

  printT2(userId) {
    // const user = this.personnelService.getOne(userId);
    return this.printDoc(printer.createPdfKitDocument(docDefinition))
  }

  printDoc(doc) {
    return new Promise((res) => {
      const chunks = [];

      doc.on('data', chunk => {
        chunks.push(chunk);
      });
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        res(result);
      });
      doc.end();
    })
  }


}
