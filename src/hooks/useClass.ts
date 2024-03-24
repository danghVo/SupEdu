import { useQuery } from '@tanstack/react-query';
import { ClassController } from '~/controller/class.controller';

export default function useClass(uuid: string) {
    const classController = new ClassController();

    return useQuery({
        queryKey: ['class', uuid],
        queryFn: () => classController.getClass(uuid),
        staleTime: Infinity,
    });
}
