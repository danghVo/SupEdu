import React from 'react';
import SideBar from '../components/SideBar';

export default function MyClassLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            <SideBar />
            <div className="grow bg-main">
                {/* <Header /> */}
                <div>{children}</div>
            </div>
        </div>
    );
}
