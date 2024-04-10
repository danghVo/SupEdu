import { useQuery } from '@tanstack/react-query';
import { PostController } from '~/controller';

export default function useSubmits(postUuid: string) {
    const postController = new PostController();

    return useQuery({
        queryKey: ['submits'],
        queryFn: () => postController.getSubmits(postUuid),
    });
}
