
import * as fs from 'fs';
import {IFileUpload} from '../../../shared/interfaces/file-upload';

const multer = require('multer');
export const MULTER_PARENT_DIR_LOCAL = '/upload';
export const MULTER_DIR_LOCAL = MULTER_PARENT_DIR_LOCAL + '/document/';
export const MULTER_PARENT_DIR = __dirname + '/../../..' + MULTER_PARENT_DIR_LOCAL;
export const MULTER_DIR = MULTER_PARENT_DIR + '/document/';

/*if (!fs.existsSync(MULTER_PARENT_DIR)) {
  fs.mkdir(MULTER_PARENT_DIR, () => {});
}
if (!fs.existsSync(MULTER_DIR)) {
  fs.mkdir(MULTER_DIR, () => {});
}

const storage = multer.diskStorage({
  destination: function (req, file: IFileUpload, cb) {
    cb(null, MULTER_DIR);
  },
  filename: function (req, file: IFileUpload, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});*/
