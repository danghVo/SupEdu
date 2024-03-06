import { AuthService, UserService } from '../service';

export class UserController {
    async signIn(payload: { email: string; password: string }) {
        const auth = new AuthService();

        const res = await auth.signIn(payload);

        if (res?.data['access_token']) {
            window.localStorage.setItem('token', res.data['access_token']);

            const profile = await this.profile();

            return profile;
        }

        return res.data;
    }

    async signUp(payload: { email: string; password: string; name: string; role: string; age: number }) {
        const auth = new AuthService();

        const res = await auth.signUp(payload);

        return res.data;
    }

    async profile() {
        const user = new UserService();

        const res = await user.profile();

        return res.data;
    }

    // async getUsers(req: any, res: any) {
    //     // Your code here
    // }
    // async getUser(req, res) {
    //     // Your code here
    // }
    // async createUser(req, res) {
    //     // Your code here
    // }
    // async updateUser(req, res) {
    //     // Your code here
    // }
    // async deleteUser(req, res) {
    //     // Your code here
    // }
}
