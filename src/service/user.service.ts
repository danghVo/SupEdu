import { HTTP } from './http';

export class UserService extends HTTP {
    constructor() {
        super(window.localStorage.getItem('token') || '');
    }

    async profile() {
        return await this.get('/user/profile');
    }
}
