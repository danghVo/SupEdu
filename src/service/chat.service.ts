import { HTTP } from './http';

export class ChatService extends HTTP {
    constructor() {
        super(typeof window === 'undefined' ? '' : window.localStorage.getItem('token'));
    }

    async getAllChatAvail() {
        return await this.get('/chat/avail');
    }

    async getChatInfor() {
        return await this.get('/chat/infor');
    }

    async getHistory(withUserUuid: string) {
        return await this.get(`/chat/history/${withUserUuid}`);
    }

    async sendMessage(toUuid: string, message: string) {
        return await this.post(`/chat/send`, { message, toUuid });
    }
}
