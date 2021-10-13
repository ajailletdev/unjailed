import { User } from '@/entities/user.entity';
import router from '@/router';
import axios from 'axios';
import { Subject } from 'rxjs';
import folderService from './folder-service';


class AuthService {

    private jwtToken: string | null = null;
    private user: User | null = null;
    public userSubject: Subject<User | null> = new Subject();

    public constructor () {
        this.setUserToken();
    }

    public emitUser(): void {
        this.userSubject.next(this.user);
    }


    public async onLogin(login: string, password: string): Promise<boolean> {
        try {
            const res = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/auth/login`, {
                username: login,
                password
            });
            localStorage.setItem('jwtToken', res.data.access_token);
            localStorage.setItem('login', res.data.user.login);
            await this.setUserToken();
            await folderService.initializeCurrentFolder();
            router.push('/documents');
            return true;
        }
        catch (err) {
            this.jwtToken = null;
            this.user = null;
            this.emitUser();
            return false;
        }
        
    }

    public async logout (): Promise<void> {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('login');
        await this.setUserToken()
        router.push('login');
    }

    public getJwtToken(): string | null {
        return this.jwtToken;
    }

    public isLogggedIn(): boolean {
        if (this.jwtToken) {
            return true;
        }
        else return false;
    }

    private async setUserToken () {
        const login = localStorage.getItem('login');
        this.jwtToken = localStorage.getItem('jwtToken');

        if (login !== null) {
            try {
                const res = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/user/${login}`, {
                    headers: {
                        'Authorization': `Bearer ${this.jwtToken}`,
                    }
                });
                this.user = res.data;
            }
            catch (err) {
                this.user = null;
            }
        } else {
            this.user = null;
        }
        this.emitUser();
    }
}

export default new AuthService();