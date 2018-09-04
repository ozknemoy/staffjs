import {IPersonnel} from '../personnel.interface';


export interface IPassport {
  id: number
  personnel: IPersonnel
  birthDate: Date
  birthPlace: string
  citizenship: string
  maritalStatus: string
  number: string
  passportIssued: string
  passportDate: Date
  address: string
  passportRegDate: Date
}
