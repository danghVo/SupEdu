import { HTTP } from './http';

export class PostService extends HTTP {
    constructor() {
        super(typeof window === 'undefined' ? '' : window.localStorage.getItem('token'));
    }

    async checkExist(postUuid: string) {
        return await this.get(`/post/${postUuid}/check`);
    }

    async getAllPost(classUuid: string) {
        return await this.get(`/post/all/${classUuid}`);
    }

    async getAllExercises(classUuid: string) {
        return await this.get(`/post/all/exercises/${classUuid}`);
    }

    async getExercise(postUuid: string) {
        return await this.get(`/post/exercise/${postUuid}`);
    }

    async getVote(postUuid: string) {
        return await this.get(`/post/vote/${postUuid}`);
    }

    async getComments(postUuid: string) {
        return await this.get(`/post/comment/${postUuid}`);
    }

    async getTaskInDate(classUuid: string, date: string) {
        return await this.get(`/post/${classUuid}/task?date=${date}`);
    }

    async createPost(classUuid: string, payload: any) {
        return await this.post(`/post/${classUuid}`, payload, {}, true);
    }

    async updatePost(classUuid: string, payload: any, postUuid: string) {
        return await this.patch(`/post/${classUuid}/${postUuid}`, payload, {}, true);
    }

    async deletePost(classUuid: string, postUuid: string) {
        return await this.delete(`/post/${classUuid}/${postUuid}`);
    }

    async getSubmits(postUuid: string) {
        return await this.get(`/post/submit/${postUuid}`);
    }

    async submitExercise(postUuid: string, payload: any) {
        return await this.post(`/post/submit/${postUuid}`, payload, {}, true);
    }

    async comment(postUuid: string, payload: any) {
        return await this.post(`/post/comment/${postUuid}`, payload);
    }

    async vote(voteUuid: string, optionUuid?: string) {
        return await this.put(`/post/vote/${voteUuid}`, { optionUuid });
    }

    async markScore(classUuid: string, submitUuid: string, score: string, feedback: string) {
        return await this.patch(`/post/${classUuid}/submit/mark/${submitUuid}`, { score, feedback });
    }
}
