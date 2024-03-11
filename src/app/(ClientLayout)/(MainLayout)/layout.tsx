'use client';

import { useEffect } from 'react';
import SideBar from './components/SideBar';
import { UserController } from '~/controller';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function layout({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const router = useRouter();

    useEffect(() => {
        if (window.localStorage.getItem('token')) {
            fetchProfile();
        } else router.push('/SignIn');
    }, []);

    const fetchProfile = async () => {
        const user = new UserController();

        const data = await queryClient.fetchQuery({
            queryKey: ['user'],
            queryFn: () => user.profile(),
        });

        queryClient.setQueryData(['user'], data);
    };

    return (
        <div className="min-h-screen flex">
            <SideBar />
            <div className="grow bg-main ml-[48px]">{children}</div>
        </div>
    );
}
