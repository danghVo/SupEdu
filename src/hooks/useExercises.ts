import { useQuery } from '@tanstack/react-query';
import { PostController } from '~/controller';

export default function useExercises(classUuid: string) {
    const postController = new PostController();

    return useQuery({
        queryKey: ['exercises', classUuid],
        queryFn: () => postController.getAllExercises(classUuid),
    });
}
