import { useQuery } from '@tanstack/react-query';
import { PostController } from '~/controller';

export default function useExercise(postUuid: string) {
    const postController = new PostController();

    return useQuery({
        queryKey: ['exercise', postUuid],
        queryFn: () => postController.getExercise(postUuid),
    });
}
