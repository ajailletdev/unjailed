import { User } from "./user.entity";

export class AccessRight {

    constructor (acc: AccessRight) {
        this.id = acc.id;
        this.userId = acc.id;
        this.documentId = acc.documentId;
        this.user = acc.user;
        this.document = acc.document;
    }

    id?: string;
    userId: string;
    documentId: string;
    user?: User;
    document?: Document;
}