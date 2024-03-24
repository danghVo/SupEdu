import { HTTP } from './http';

export class PostService extends HTTP {
    constructor() {
        super(typeof window === 'undefined' ? '' : window.localStorage.getItem('token'));
    }

    async createPost(payload: any, classUuid: string) {
        return await this.post(`/class/${classUuid}/post/create`, payload, {}, true);
    }

    async getAllPost(classUuid: string) {
        return await this.get(`/class/${classUuid}/post/all`);
    }
}
