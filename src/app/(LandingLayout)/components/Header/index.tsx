'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import image from '~/assets/image';

import Nav from './Nav';
import Button from '~/components/Button/index';
import Link from 'next/link';

export default function Header() {
    const [bgColor, setBgColor] = useState('transparent');

    useEffect(() => {
        const handleSetOpacity = () => {
            let opacity = 'transparent';
            if (window.scrollY > 0) {
                opacity = '#ffffffcc';
            }
            setBgColor(opacity);
        };

        window.addEventListener('scroll', handleSetOpacity);

        return () => {
            window.removeEventListener('scroll', handleSetOpacity);
        };
    }, []);

    return (
        <div
            className={`h-[70px] w-full fixed z-50 top-0 backdrop-blur-sm right-0 flex px-24 items-center justify-between transition-colors ease-linear duration-200`}
            style={{ backgroundColor: bgColor }}
        >
            <Image src={image.logo} width={100} height={100} alt="SupEdu" />

            <div className="flex gap-4">
                <Link href={'/SignIn'}>
                    <Button handleClick={() => {}}>Đăng nhập</Button>
                </Link>
            </div>
        </div>
    );
}
