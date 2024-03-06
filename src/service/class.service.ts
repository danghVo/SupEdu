import { HTTP } from './http';

export class ClassService extends HTTP {
    constructor() {
        super(window.localStorage.getItem('token') || '');
    }

    async getClasses() {
        return await this.get('/class/all');
    }

    async getClass(id: string) {
        return await this.get(`/class/${id}`);
    }

    async createClass(payload: { name: string; description: string; teacher: string; students: string[] }) {
        return await this.post('/class', payload);
    }

    async updateClass(id: string, payload: { name: string; description: string; teacher: string; students: string[] }) {
        return await this.post(`/class/${id}`, payload);
    }

    async deleteClass(id: string) {
        return await this.post(`/class/${id}`);
    }
}
