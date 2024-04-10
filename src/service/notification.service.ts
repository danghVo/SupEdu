import { HTTP } from './http';

export class NotificationService extends HTTP {
    constructor() {
        super(typeof window === 'undefined' ? '' : window.localStorage.getItem('token'));
    }

    async getNotification() {
        return await this.get('/notification/all');
    }

    async readNotification(uuid: string) {
        return await this.patch(`/notification/read/${uuid}`);
    }

    async deleteNotification(uuid: string) {
        return await this.delete(`/notification/delete/${uuid}`);
    }

    async deleteAllNotification() {
        return await this.delete('/notification/all');
    }
}
