import { User } from '@/entities/user.entity';
import router from '@/router';
import axios from 'axios';
import { Subject } from 'rxjs';
import VueJwtDecode from "vue-jwt-decode";


class AuthService {

    private jwtToken: string | null = null;
    private user: User | null = null;
    public userSubject: Subject<User | null> = new Subject();

    public emitUser(): void {
        this.userSubject.next(this.user);
    }


    public async onLogin(login: string, password: string): Promise<void> {
        try {
            const res = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/auth/login`, {
                username: login,
                password
            });
            this.jwtToken = res.data.access_token;
            this.user = VueJwtDecode.decode(this.jwtToken);
            this.emitUser();
            router.push('/documents');
        }
        catch (err) {
            this.jwtToken = null;
            axios.defaults.headers.common['Authorization'] = this.jwtToken;
            this.user = null;
            this.emitUser();
        }
        
    }

    public logout (): void {
        this.jwtToken = null;
        this.user = null;
        this.emitUser();
        router.push('login');
    }

    public getJwtToken(): string | null {
        return this.jwtToken;
    }
}

export default new AuthService();