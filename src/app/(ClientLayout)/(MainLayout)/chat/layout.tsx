'use client';

import { useEffect, useState } from 'react';
import ChatInfor from './components/ChatInfor';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-full overflow-hidden">
            <div className="w-[300px]">
                <ChatInfor />
            </div>

            {children}
        </div>
    );
}
