'use client';

import SideBar from './components/SideBar';
import { useRouter } from 'next/navigation';
import useProfile from '~/hooks/useProfile';

export default function layout({ children }: { children: React.ReactNode }) {
    const { data, isSuccess } = useProfile();
    const router = useRouter();

    if (isSuccess) {
        if (data.error) {
            router.push('/SignIn');
        }
    }

    return (
        <div className="min-h-screen flex">
            <SideBar />
            <div className="grow bg-main ml-[48px]">{children}</div>
        </div>
    );
}
