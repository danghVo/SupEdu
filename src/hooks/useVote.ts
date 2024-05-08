import { useQuery } from '@tanstack/react-query';
import { PostController } from '~/controller';

export default function useVote(postUuid: string | undefined) {
    const postController = new PostController();

    // if (!postUuid) {
    //     
    // }

    return useQuery({
        queryKey: ['vote', postUuid],
        queryFn: () => {
            if (postUuid) {
                return postController.getVote(postUuid)
            }
            else return {
            data: null,
            isSuccess: false,
            isRefetching: false,
            refetch: null,
        };
        },
        staleTime: Infinity,
    });
}
