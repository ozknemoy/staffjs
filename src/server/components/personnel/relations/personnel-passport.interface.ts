import {IPersonnel} from '../personnel.interface';


export interface IPassport {
  id: number
  personnel: IPersonnel
  birthDate: string
  birthPlace: string
  citizenship: string
  maritalStatus: string
  number: string
  passportIssued: string
  passportDate: string
  address: string
  passportRegDate: string
}
