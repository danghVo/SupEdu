import { PostService } from '~/service/post.service';

export class PostController {
    async createPost(payload: any, classUuid: string) {
        const service = new PostService();

        const res = await service.createPost(payload, classUuid);

        return res.data;
    }

    async getAllPost(classUuid: string) {
        const service = new PostService();

        const res = await service.getAllPost(classUuid);

        return res.data;
    }
}
