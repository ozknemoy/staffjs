import {Injectable} from '@nestjs/common';
import {PersonnelService} from '../personnel/personnel.service';
import {PrintT2Builder} from './print-t2.class';
import {IPdfSchema} from '../../interfaces/pdf-shema.interface';
import * as fs from 'fs-extra';
import {PrintLaborContractDynamicBuilder} from './print-labor-contract.class';
import * as docx from "docx";
import LaborContractDocx from "./labor-contract-docx.model";
import {ErrHandler} from "../../services/error-handler.service";
import {dirLaborContractDocx} from "../upload/upload.service";

const path = require('path');
const DocxMerger = require('../../../shared/docx-merger/docx-merger-dist.js');


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
    return this.printLaborContract(194, '1', true);
  }

  async printT2(userId) {
    const user = await this.personnelService.getOneFull(userId);
    const pdfSchema: IPdfSchema.Root = new PrintT2Builder(user).make();
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

  async printLaborContract(userId, typePart2, saveLocal) {
    const docx = await LaborContractDocx.findOne({where: {type: +typePart2}});
    if (!docx || !docx.url) {
      ErrHandler.throw('Сначала загрузите статическую часть договора')
    }
    // наличие папки с файлами не проверяю тк если загружен хотя бы один файл то папка существует
    const part2Uint = fs.readFileSync(dirLaborContractDocx + docx.url);
    const user = await this.personnelService.getOneFull(userId);
    const [part1, part3] = new PrintLaborContractDynamicBuilder(user).make();
    const part1Uint = await this.createOfficeFileUint8(part1);
    const part3Uint = await this.createOfficeFileUint8(part3);
    const merger = new DocxMerger({pageBreak: false}, [part1Uint, part2Uint, part3Uint]);

    return new Promise((res, fail) => {
      merger.save('nodebuffer', (uint) => {
        res(saveLocal
          ? this.createOfficeFileLocal(uint)
          // браузеру нужен именно буффер
          : Buffer.from(uint)
        )
      });
    });
  }

  async createOfficeFileBuffer(dox): Promise<Buffer> {
    return Buffer.from(await <any>this.createOfficeFileUint8(dox))
  }

  createOfficeFileUint8(doc): Promise<Uint8Array> {
    // якобы возвращает Buffer а на самом деле Uint8Array
    // buffer['buffer'] это будет ArrayBuffer из Uint8Array
    return <any>(new docx.Packer()).toBuffer(doc)
  }

  createOfficeFileLocal(uint8) {
    const dir = `${fs.existsSync('E:/') ? 'E' : 'C'}:/files/`;
    const name = 'doc-dev';
    const ext = '.docx';
    console.log('-----  ok make  -----');
    // пробую писать
    fs.ensureDirSync(dir);
    fs.writeFile(dir + name + ext, uint8, (e) => {
      if (e) {
        console.log('*****    ', e.code, '  make with timestamp  *****');
        // при неудаче добавляю номер
        fs.writeFileSync(`${dir}${name}-${ +new Date}${ext}`, uint8);
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
    return {savedLocally: true};
  }

  printOffice(doc) {
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
