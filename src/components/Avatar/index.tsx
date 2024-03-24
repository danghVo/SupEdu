import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

import image from '~/assets/image';

interface AvatarProps {
    className?: string;
    userInfor: {
        avatar: string;
        name: string;
        email: string;
    };
}

export default function Avatar({ className, userInfor }: AvatarProps) {
    const [isShowInfor, setIsShowInfor] = useState(false);

    return (
        <div
            className="relative after:content-[''] after:block after:absolute after:top-0 after:left-[100%] after:w-[10px] after:h-full"
            onMouseEnter={() => {
                setIsShowInfor(true);
            }}
            onMouseLeave={() => [setIsShowInfor(false)]}
        >
            <Image src={userInfor.avatar || image.teacher} alt="avatar" className={`w-[40px] h-[40px] ${className}`} />

            {isShowInfor && (
                <motion.div
                    initial={{ opacity: 0, width: 0, height: 0 }}
                    animate={{ opacity: 1, width: 'fit-content', height: 'fit-content' }}
                    className="bg-white overflow-hidden absolute top-[0] left-[110%] rounded-2xl shadow-custom-2"
                >
                    <div className="px-[16px] py-[12px]">
                        <div className="text-[18px] mb-[8px]">{userInfor.name}</div>
                        <div className="text-slate-400">{userInfor.email}</div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
