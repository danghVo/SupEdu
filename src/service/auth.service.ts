import { HTTP } from './http';

export class AuthService extends HTTP {
    constructor() {
        super(null);
    }

    async signIn(payload: Object) {
        return await this.post('/auth/signin', payload);
    }

    async signUp(payload: object) {
        return await this.post('/auth/signup', payload);
    }

    async resendVerifyMail(uuid: string) {
        return await this.get(`/auth/resend-verify-mail/${uuid}`);
    }
}
