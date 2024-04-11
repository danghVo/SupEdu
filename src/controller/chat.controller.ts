import { ChatService } from '~/service';

export class ChatController {
    private service;

    constructor() {
        this.service = new ChatService();
    }

    async getAllChatAvail() {
        const res = await this.service.getAllChatAvail();

        return res.data;
    }

    async getChatInfor() {
        const res = await this.service.getChatInfor();

        return res.data;
    }

    async getHistory(withUserUuid: string) {
        const res = await this.service.getHistory(withUserUuid);

        return res.data;
    }

    async sendMessage(toUuid: string, message: string) {
        const res = await this.service.sendMessage(toUuid, message);

        return res.data;
    }
}
