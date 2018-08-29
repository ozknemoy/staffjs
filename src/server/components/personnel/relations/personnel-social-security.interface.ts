import {IPersonnelNamedThingWithDoc} from "./personnel-named-thing-with-doc.interface";


export class ISocialSecurity extends IPersonnelNamedThingWithDoc {
  socialSecurityDocId: number;
  reason: string
}
