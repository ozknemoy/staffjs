import {Component} from '@nestjs/common';
import {PersonnelService} from '../personnel/personnel.service';
import {PrintT2Builder} from './print-t2.class';
import {IPdfSchema} from '../../interfaces/pdf-shema.interface';
import * as fs from 'fs';
import {docsHeaders, PrintLaborContractScientificBuilder} from './print-labor-contract-scientific.class';
import {PrintLaborContractScientificBuilder2} from './print-labor-contract-scientific2.class';
import * as docx from "docx";

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

  async saveLocalForDevelopmentPdf() {
    const file = await this.printT2(1);
    fs.writeFile('t2-dev.pdf', file, (e) => {
      console.log('------saveLocalForDevelopment------', e);
    });
    return;
  }
  async saveLocalForDevelopmentDocx() {
    const file = await this.printLaborContractScientificBuilder(1);

    /*
    console.log('------------------', file);
    writeFile('doc-dev.docs', file, (e) => {
      console.log('+++++++saveLocalForDevelopment++++++', e);
    });*/
    return;
  }

  async printT2(userId) {
    const user = await this.personnelService.getOneFull(userId);
    const pdfSchema: IPdfSchema.Root = new PrintT2Builder(user).make();
    // console.log('***', pdfSchema.content);
    return this.printPdf(printer.createPdfKitDocument(pdfSchema));
  }

  async printPdf(doc) {
    return new Promise((res) => {
      const chunks = [];
      doc
        .on('data', chunk => {
          chunks.push(chunk);
        })
        .on('end', () => {
          const result = Buffer.concat(chunks);
          res(result);
        })
        .end();
    });
  }

  async printLaborContractScientificBuilder(userId) {
    const user = await this.personnelService.getOneFull(userId);
    const dox = new PrintLaborContractScientificBuilder2(user).make();
    //console.log('------------------', docx);
    return this.createOfficeFile(dox);
  }

  createOfficeFile(doc) {
    // Used to export the file into a .docx file
    //console.log('-------------', doc);
    (new docx.Packer()).toBuffer(doc).then((b) => {
      //console.log(buffer);
      console.log('-----', b);
      fs.writeFileSync("doc-dev2.docx", b);
    });

    //
    //exporter.pack("doc-dev2.docx");
    /*const out = fs.createWriteStream('doc-dev.docx');

    doc.generate(out, {
      'finalize': function (written) {
        //console.log('Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n');
      },
      'error': function (err) {
        //console.log(err);
      }
    });*/
  }

  async printOffice(doc) {
    
    return new Promise((res) => {
      doc
        .on('finalize', function (written, ret) {
          console.log('Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n' + ret);
          res(written);
        })
        .on('error', function (err) {
          console.log(err);
        });


    });

  }
}
