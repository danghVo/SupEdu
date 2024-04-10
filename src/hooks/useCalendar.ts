import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ClassController } from '~/controller';

export default function useCalendar(uuid: string) {
    const classController = new ClassController();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['calendar', uuid],
        queryFn: () => classController.getCalendar(uuid),
    });
}
