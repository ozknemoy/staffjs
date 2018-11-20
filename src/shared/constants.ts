import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

export const FOLDER_DIST = join(process.cwd(), 'dist');
export const FOLDER_CLIENT = 'client';
export const FOLDER_SERVER = 'server';
export const FILES_FOLDER_SERVER = 'files';

export const WORKING_DIRECTORY = process.env.NODE_ENV === 'production'
  ? FOLDER_DIST
  : join(process.cwd(), 'src');

export const INSTITUTIONS_NAME = 'ГУАП';

export const dirWorkHistory = join(process.cwd(), FILES_FOLDER_SERVER, 'work-history/');
