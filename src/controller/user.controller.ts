import { AuthService, UserService } from '../service';

export class UserController {
    async signIn(payload: { email: string; password: string }) {
        const auth = new AuthService();

        const res = await auth.signIn(payload);

        if (res.data.hasOwnProperty('access_token')) {
            window.localStorage.setItem('token', res.data['access_token']);
        }

        return res.data;
    }

    async signUp(payload: { email: string; password: string; name: string; role: string; age: number }) {
        const auth = new AuthService();

        const res = await auth.signUp(payload);

        return res.data;
    }

    async logOut(uuid: string) {
        const auth = new AuthService();

        const res = await auth.logOut(uuid);

        return res.data;
    }

    async resendVerifyMail(uuid: string) {
        const auth = new AuthService();

        const res = await auth.resendVerifyMail(uuid);

        return res.data;
    }

    async profile() {
        const user = new UserService();

        const res = await user.profile();

        return res.data;
    }

    async updateProfile(payload: any) {
        const user = new UserService();

        const res = await user.updateProfile(payload);

        return res.data;
    }

    async getUuid(email: string) {
        const user = new UserService();

        const res = await user.getUuid(email);

        return res.data;
    }

    async changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
        const user = new UserService();

        const res = await user.changePassword(oldPassword, newPassword, confirmPassword);

        return res.data;
    }
}
