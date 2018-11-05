import {HttpException, HttpStatus} from "@nestjs/common";
import {UniqueConstraintError} from "sequelize";

export class ErrHandlerService {

  public STATUS_FOR_VALID_AND_UNIQUE_ERR = HttpStatus.NOT_ACCEPTABLE;

  static throw(err: string, code = HttpStatus.INTERNAL_SERVER_ERROR) {
    // tclb передавать не массив ошибки а строку то преобразуется в объект
    throw new HttpException([err], code);
  }

  // пока простое преобразование в массив ошибок  вложенность в errors
  handle(err: string | string[], code = this.STATUS_FOR_VALID_AND_UNIQUE_ERR) {
    throw new HttpException(Array.isArray(err) ? err : [err], code);
  }

  /*is like SequelizeValidationError*/
  sentToFront(err) {
    console.log('ErrHandlerService.sentToFront___________________', Object.keys(err), err);
    return this.handle(err.errors.map(e => e.message), this.STATUS_FOR_VALID_AND_UNIQUE_ERR)
  }

  sendForbidden() {
    return this.handle('Не хватает прав', HttpStatus.FORBIDDEN)
  }

  handlaAll(e, tableName?, uniqueFields?, status = this.STATUS_FOR_VALID_AND_UNIQUE_ERR) {
    switch (e.name) {
      case "SequelizeUniqueConstraintError":
        // отдаю поля uniqueFields={email:'Email уже существует'}
        for (const key in uniqueFields) {
          // сравниваю с tableName + '_email_......'
          if (e.parent.constraint.indexOf(`${tableName}_${key}_`) >= 0) {
            return this.handle(uniqueFields[key], status);
          }
        }
        break;
      case 'SequelizeDatabaseError': {
        return this.handle('ошибка БД: ' + (e.parent ? e.parent.toString() : ''), HttpStatus.BAD_REQUEST)
      }
      case 'SequelizeValidationError':
        return this.sentToFront(e);
    }
    console.log('ErrHandlerService.handleAll___________________', e);
    return this.handle(e/*.toString()*/, status)

  }

}

