import { User } from "@/entities/user.entity";
import axios from "axios";

const API_PATH = process.env.VUE_APP_BACKEND_URL;

class UserService {

    private users: User[] = [];
    
    public async getUsers (): Promise<User[]> {
        if (this.users.length === 0) {
            try {
                const res = await axios.get(`${API_PATH}/user`);
                this.users = (res.data as User[]).map((user) => new User(user));
            }
            catch (_) {
                console.error(_);
                return [];
            }
        }
        return this.users;
    }
}

export default new UserService();