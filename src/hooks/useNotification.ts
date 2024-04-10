import { useQuery } from '@tanstack/react-query';
import { NotificationController } from '~/controller';

export default function useNotification() {
    const notificationController = new NotificationController();

    return useQuery({
        queryKey: ['notification'],
        queryFn: () => notificationController.getNotification(),
        staleTime: Infinity,
    });
}
