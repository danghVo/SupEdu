import { PostService } from '~/service/post.service';

export class PostController {
    private service: PostService;

    constructor() {
        this.service = new PostService();
    }

    async checkExist(postUuid: string) {
        const res = await this.service.checkExist(postUuid);

        return res.data;
    }

    async getAllPost(classUuid: string) {
        const res = await this.service.getAllPost(classUuid);

        return res.data;
    }

    async getAllExercises(classUuid: string) {
        const res = await this.service.getAllExercises(classUuid);

        return res.data;
    }

    async getExercise(postUuid: string) {
        const res = await this.service.getExercise(postUuid);

        return res.data;
    }

    async getVote(postUuid: string) {
        const res = await this.service.getVote(postUuid);

        return res.data;
    }

    async getComments(postUuid: string) {
        const res = await this.service.getComments(postUuid);

        return res.data;
    }

    async getTaskInDate(classUuid: string, date: string) {
        const res = await this.service.getTaskInDate(classUuid, date);

        return res.data;
    }

    async createPost(classUuid: string, payload: any) {
        const res = await this.service.createPost(classUuid, payload);

        return res.data;
    }

    async updatePost(classUuid: string, payload: any, postUuid: string) {
        const res = await this.service.updatePost(classUuid, payload, postUuid);

        return res.data;
    }

    async deletePost(classUuid: string, postUuid: string) {
        const res = await this.service.deletePost(classUuid, postUuid);

        return res.data;
    }

    async getSubmits(postUuid: string) {
        const res = await this.service.getSubmits(postUuid);

        return res.data;
    }

    async submitExercise(postUuid: string, payload: any) {
        const res = await this.service.submitExercise(postUuid, payload);

        return res.data;
    }

    async comment(postUuid: string, payload: any) {
        const res = await this.service.comment(postUuid, payload);

        return res.data;
    }

    async vote(voteUuid: string, optionUuid?: string) {
        const res = await this.service.vote(voteUuid, optionUuid);

        return res.data;
    }

    async removeVote(voteUuid: string) {
        const res = await this.service.vote(voteUuid);

        return res.data;
    }

    async markScore(classUuid: string, submitUuid: string, score: string, feedback: string) {
        const res = await this.service.markScore(classUuid, submitUuid, score, feedback);

        return res.data;
    }
}
