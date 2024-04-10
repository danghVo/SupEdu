import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';
import { ChatController } from '~/controller';

export default function useChatInfor() {
    const chatController = new ChatController();
    const queryClient = useQueryClient();

    useLayoutEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ['chatInfor'],
        });
    }, []);

    return useQuery({
        queryKey: ['chatInfor'],
        queryFn: () => chatController.getChatInfor(),
        staleTime: Infinity,
    });
}
