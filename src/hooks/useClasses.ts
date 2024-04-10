import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ClassController } from '~/controller/class.controller';
import { useLayoutEffect } from 'react';

export default function useClasses() {
    const classController = new ClassController();
    const queryClient = useQueryClient();

    useLayoutEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ['classShow', 'join'],
        });
    }, []);

    return useQuery({
        queryKey: ['classShow', 'join'],
        queryFn: () => classController.getClasses('join'),
    });
}
