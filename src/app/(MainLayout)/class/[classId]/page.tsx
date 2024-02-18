'use client';
import { redirect, usePathname } from 'next/navigation';

export default function Page() {
    const pathName = usePathname();

    return redirect(pathName + '/post');
}
