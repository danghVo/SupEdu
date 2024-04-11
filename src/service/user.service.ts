import { HTTP } from './http';

export class UserService extends HTTP {
    constructor() {
        super(window.localStorage.getItem('token') || '');
    }

    async getUuid(email: string) {
        return await this.get(`/user/uuid?email=${email}`);
    }

    async profile() {
        return await this.get('/user/profile');
    }

    async updateProfile(payload: any) {
        return await this.patch('/user/updateProfile', payload, {}, true);
    }

    async changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
        return await this.put('/user/changePassword', { oldPassword, newPassword, confirmPassword });
    }
}
