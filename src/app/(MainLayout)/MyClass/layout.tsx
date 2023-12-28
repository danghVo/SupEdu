import React from 'react';
import SideBar from '../components/SideBar';
import Header from '../components/Header';

export default function MyClassLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            <SideBar />
            <div className="grow bg-black">
                {/* <Header /> */}
                <div>{children}</div>
            </div>
        </div>
    );
}
