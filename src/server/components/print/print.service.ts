import {Injectable} from '@nestjs/common';
import {PersonnelService} from '../personnel/personnel.service';
import {PrintT2Builder} from './print-t2.class';
import {IPdfSchema} from '../../interfaces/pdf-shema.interface';
import * as fs from 'fs';
import {PrintLaborContractScientificBuilder} from './print-labor-contract-scientific.class';
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


@Injectable()
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
    return this.printLaborContractScientific(1, true);
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

  async printLaborContractScientific(userId, dev = false) {
    const user = await this.personnelService.getOneFull(userId);
    const dox = new PrintLaborContractScientificBuilder(user).make();
    return dev
      ? this.createOfficeFileLocal(dox)
      : this.createOfficeFileForBrowser(dox);
  }

  async createOfficeFileForBrowser(dox): Promise<Buffer> {
    return Buffer.from(await <any>this.createOfficeFileBuffer(dox))
  }

  createOfficeFileBuffer(doc): Promise<Uint8Array> {
    // якобы возвращает Buffer а на самом деле Uint8Array
    // buffer['buffer'] это будет ArrayBuffer из Uint8Array
    return <any>(new docx.Packer()).toBuffer(doc)
  }

  createOfficeFileLocal(doc) {
    const dir = `${fs.existsSync('E:/') ? 'E' : 'C'}:/files/`;
    const name = 'doc-dev';
    const ext = '.docx';
    this.createOfficeFileBuffer(doc).then((b) => {
      console.log('-----  ok make  -----');
      // пробую писать
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      fs.writeFile(dir + name + ext, b, (e) => {
        if (e) {
          console.log('*****    ', e.code, '    *****');
          // при неудаче добавляю номер
          fs.writeFileSync(`${dir}${name}-${ +new Date}${ext}`, b);
        } else {
          console.log('-----  ok write  ----');
          // при удаче удаляю файлы с номерами
          fs.readdir(dir, (_e, files) => {
            if (files.length) {
              files.forEach(fileName => {
                if (fileName.indexOf(name + '-') > -1) {
                  fs.unlink(dir + fileName, () => {
                  })
                }
              })
            }
          })
        }

      });
    });
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
