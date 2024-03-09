'use client';

import { useEffect, useState } from 'react';
import ChatInfor from './components/ChatInfor';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children?: React.ReactNode }) {
    const [currentChat, setCurrentChat] = useState<string>('');
    const pathName = usePathname();

    useEffect(() => {
        setCurrentChat(pathName.split('/')[2]);
    }, [pathName]);

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-[300px]">
                <ChatInfor currnetChat={currentChat} />
            </div>

            {children}
        </div>
    );
}
