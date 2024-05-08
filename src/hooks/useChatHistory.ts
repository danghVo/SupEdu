import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useLayoutEffect } from 'react';
import { ChatController } from '~/controller';

export default function useChatHistory(uuid: string) {
    const chatController = new ChatController();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['chat', uuid],
        queryFn: async () => {
            const data = await chatController.getHistory(uuid);
            await queryClient.invalidateQueries({
                queryKey: ['chatInfor'],
            });

            return data;
        },
    });
}
