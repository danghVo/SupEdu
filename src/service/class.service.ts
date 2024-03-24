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

    async createClass(payload: any) {
        return await this.post('/class/create', payload, {}, true);
    }

    async updateClass(id: string, payload: { name: string; description: string; teacher: string; students: string[] }) {
        return await this.post(`/class/${id}`, payload);
    }

    async deleteClass(id: string) {
        return await this.post(`/class/${id}`);
    }

    async joinClass(classUuid: string, password: string | null) {
        return await this.post(`/class/join/${classUuid}`, { password });
    }
}
