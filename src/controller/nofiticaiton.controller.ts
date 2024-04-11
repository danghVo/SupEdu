import { AuthService, NotificationService, UserService } from '../service';

export class NotificationController {
    private service;

    constructor() {
        this.service = new NotificationService();
    }

    async getNotification() {
        const res = await this.service.getNotification();

        return res.data;
    }

    async readNotification(uuid: string) {
        const res = await this.service.readNotification(uuid);

        return res.data;
    }

    async deleteNotification(uuid: string) {
        const res = await this.service.deleteNotification(uuid);

        return res.data;
    }

    async deleteAllNotification() {
        const res = await this.service.deleteAllNotification();

        return res.data;
    }
}
