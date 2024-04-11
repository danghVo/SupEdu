import { HTTP } from './http';

export class ClassService extends HTTP {
    constructor() {
        super(typeof window === 'undefined' ? '' : window.localStorage.getItem('token'));
    }

    async getAllClass() {
        return await this.get('/class/all');
    }

    async getClasses(filter?: string) {
        return await this.get('/class/' + `${filter ? filter + '/' : ''}` + 'all');
    }

    async getClass(classUuid: string) {
        return await this.get(`/class/${classUuid}`);
    }

    async getCalendar(classUuid: string) {
        return await this.get(`/class/${classUuid}/calendar`);
    }

    async createClass(payload: any) {
        return await this.post('/class', payload);
    }

    async updateClass(classUuid: string, payload: any) {
        return await this.patch(`/class/${classUuid}`, payload);
    }

    async deleteClass(classUuid: string) {
        return await this.delete(`/class/${classUuid}`);
    }

    async joinClass(classUuid: string, password: string | null) {
        return await this.post(`/class/join/${classUuid}`, { password });
    }

    async responseJoinClass(classUuid: string, userUuid: string, approve: boolean) {
        return await this.patch(`/class/${classUuid}/approve/${userUuid}`, { approve });
    }

    async addMember(classUuid: string, email: string) {
        return await this.put(`/class/${classUuid}/member`, { email });
    }

    async removeMember(classUuid: string, userUuid: string) {
        return await this.delete(`/class/${classUuid}/member/${userUuid}`);
    }

    async leaveClass(classUuid: string) {
        return await this.delete(`/class/leave/${classUuid}`);
    }

    async getMembers(classUuid: string) {
        return await this.get(`/class/${classUuid}/members`);
    }
}
