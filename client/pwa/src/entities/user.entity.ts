export class User {

    constructor(auser: User) {
        this.id = auser.id;
        this.login = auser.login;
    }
    id?: string;
    login: string;
}
