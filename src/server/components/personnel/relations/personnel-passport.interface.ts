
export class IPassport {
  constructor(public personnelId) {}
  id: number = null;
  birthDate: Date = null;
  birthPlace: string = null;
  citizenship: string = null;
  maritalStatus: string = null;
  number: string = null;
  passportIssued: string = null;
  passportDate: Date = null;
  address: string = null;
  addressFact: string = null;
  passportRegDate: Date = null;
}
