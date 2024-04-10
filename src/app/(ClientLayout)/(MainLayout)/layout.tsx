'use client';

import SideBar from './components/SideBar';
import { useRouter } from 'next/navigation';
import { createContext, useRef } from 'react';
import Notification, { NotificationType } from '~/components/Notification';
import useProfile from '~/hooks/useProfile';

export const NotificationTheme = createContext<(message: string, type: NotificationType) => void>(() => {});

export default function layout({ children }: { children: React.ReactNode }) {
    const { data, isSuccess } = useProfile();
    const router = useRouter();

    const notificationRef = useRef<{ show: (message: string, type: NotificationType) => void } | null>(null);

    if (isSuccess) {
        if (data.error) {
            router.push('/SignIn');
        }
    }

    return (
        <NotificationTheme.Provider
            value={(message, type) => {
                notificationRef.current?.show(message, type);
            }}
        >
            <div className="h-screen flex relative overflow-hidden">
                <Notification ref={notificationRef} />
                <SideBar />
                <div className="grow bg-main ml-[48px]">{children}</div>
            </div>
        </NotificationTheme.Provider>
    );
}
