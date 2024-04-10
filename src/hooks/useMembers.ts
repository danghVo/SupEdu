import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';
import { ClassController } from '~/controller';

export default function useMembers(classUuid: string) {
    const classController = new ClassController();

    return useQuery({
        queryKey: ['members', classUuid],
        queryFn: () => classController.getMembers(classUuid),
    });
}
