import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { PostController } from '~/controller';

export default function usePost(uuid: string) {
    const postController = new PostController();

    return useQuery({
        queryKey: ['posts', uuid],
        queryFn: () => postController.getAllPost(uuid),
        staleTime: Infinity,
    });
}
