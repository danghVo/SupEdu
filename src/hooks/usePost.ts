import { useQuery } from '@tanstack/react-query';
import { PostController } from '~/controller';

export default function usePost(uuid: string) {
    const postController = new PostController();

    return useQuery({
        queryKey: ['posts', uuid],
        queryFn: () => postController.getAllPost(uuid),
        staleTime: Infinity,
    });
}
