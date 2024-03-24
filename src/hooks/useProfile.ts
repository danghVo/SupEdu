import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { UserController } from '~/controller';

export default function useProfile() {
    const userController = new UserController();

    return useQuery({
        queryKey: ['user'],
        queryFn: () => userController.profile(),
        staleTime: Infinity,
    });
}
