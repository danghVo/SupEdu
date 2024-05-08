'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import Button from '~/components/Button/index';
import Link from 'next/link';

export default function Header() {
    const [bgColor, setBgColor] = useState('transparent');
    const [isLogIn, setIsLogIn] = useState(false);

    useEffect(() => {
        const handleSetOpacity = () => {
            let opacity = 'transparent';
            if (window.scrollY > 0) {
                opacity = '#ffffffcc';
            }
            setBgColor(opacity);
        };

        setIsLogIn(window.localStorage.getItem('token') ? true : false);

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
            <Image src="/image/logo.png" width={100} height={100} alt="SupEdu" />

            <div className="flex gap-4">
                    <Link href={isLogIn ? '/class' : '/SignIn'}>
                        <Button handleClick={() => { }}>
                {isLogIn ? 'Truy cập' :
                           'Đăng nhập'
                        }
                        </Button>
                </Link>
            </div>
        </div>
    );
}
