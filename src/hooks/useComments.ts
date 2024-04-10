import { useQuery } from '@tanstack/react-query';
import { PostController } from '~/controller';

export default function useComments(postUuid: string) {
    const postController = new PostController();

    return useQuery({
        queryKey: ['comments', postUuid],
        queryFn: () => postController.getComments(postUuid),
        staleTime: Infinity,
    });
}
