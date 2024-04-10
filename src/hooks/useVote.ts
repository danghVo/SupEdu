import { useQuery } from '@tanstack/react-query';
import { PostController } from '~/controller';

export default function useVote(postUuid: string | undefined) {
    const postController = new PostController();

    if (!postUuid) {
        return {
            data: null,
            isSuccess: false,
            isRefetching: false,
            refetch: null,
        };
    }

    return useQuery({
        queryKey: ['vote', postUuid],
        queryFn: () => postController.getVote(postUuid),
        staleTime: Infinity,
    });
}
