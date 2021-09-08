export class AccessRight {

    constructor (acc: AccessRight) {
        this.id = acc.id;
        this.userId = acc.id;
        this.documentId = acc.documentId;
    }

    id?: string;
    userId: string;
    documentId: string;
}