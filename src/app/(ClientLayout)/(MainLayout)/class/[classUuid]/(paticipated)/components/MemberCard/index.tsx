import Image from 'next/image';

import image from '~/assets/image';
import { roleTranslate } from '~/constant';

export interface MemberCardInfor {
    name: string;
    email: string;
    avatar: string | null;
    role: string;
}

export default function MemberCard({
    className = '',
    infor,
    actionsElement,
}: {
    className?: string;
    infor: MemberCardInfor;
    actionsElement?: React.ReactElement;
}) {
    return (
        <div
            className={`flex items-center justify-between w-[80%] h-[60px] bg-white px-[12px] py-[8px] shadow-custom-4 rounded-xl ${className}`}
        >
            <div className="flex items-center">
                <Image
                    src={
                        infor.avatar !== null ? infor.avatar : infor.role === 'TEACHER' ? image.teacher : image.student
                    }
                    width={32}
                    height={32}
                    alt={infor.name}
                    className="mr-[16px] rounded-full"
                />
                <div className="flex items-end gap-[8px]">
                    <div className="text-[18px] font-semibold">{infor.name}</div>
                    <div className="text-[16px] ">{infor.email}</div>
                    {infor.role && <div className="text-[14px] text-slate-500">{roleTranslate[`${infor.role}`]}</div>}
                </div>
            </div>
            <div className="flex items-center gap-[24px] mr-[16px]">{actionsElement}</div>
        </div>
    );
}
