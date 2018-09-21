import {Component} from "@nestjs/common";
import {PersonnelService} from "../personnel/personnel.service";
import {PrintT2Builder} from './print-t2.class';
import {IPdfSchema} from "../../interfaces/pdf-shema.interface";
import {writeFile} from 'fs';
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


@Component()
export class PrintService {

  constructor(private personnelService: PersonnelService) {}

  async saveLocalForDevelopment() {
    const file = await this.printT2(29);
    writeFile('t2-dev.pdf', file, (e) => {
      console.log('------saveLocalForDevelopment------', e);
    });
    return
  }

  async printT2(userId) {
    const user = await this.personnelService.getOneFull(userId);
    const pdfSchema: IPdfSchema.Root = new PrintT2Builder(user).make();
    // console.log('***', pdfSchema.content);
    return this.printDoc(printer.createPdfKitDocument(pdfSchema))
  }

  async printDoc(doc) {
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
