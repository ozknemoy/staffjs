import {Component} from "@nestjs/common";
import {PersonnelService} from "../personnel/personnel.service";
import {PrintT2Builder} from './print-t2.class';
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

  constructor(private personnelService: PersonnelService) {}

  async printT2(userId) {
    const user = await this.personnelService.getOne(userId);
    const pdfSchema = new PrintT2Builder(user).make();
    return this.printDoc(printer.createPdfKitDocument(pdfSchema))
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
