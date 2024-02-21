import { faComment, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import image from '~/assets/image';
import { roleTranslate } from '~/constant';

export interface MemberCardInfor {
    name: string;
    image?: string;
    role?: string;
    isOnline?: boolean;
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
                {typeof infor.isOnline !== 'undefined' && (
                    <div
                        className={`w-[14px] h-[14px] rounded-full mx-[12px] ${infor.isOnline ? 'bg-green-700' : 'bg-slate-400'}`}
                    ></div>
                )}
                <Image
                    src={infor.image || image.student}
                    alt={infor.name}
                    className="w-[32px] h-[32px] mr-[16px] rounded-full"
                />
                <div className="flex items-end gap-[8px]">
                    <div className="text-[18px] font-semibold">{infor.name}</div>
                    {infor.role && <div className="text-[14px] text-slate-500">{roleTranslate[`${infor.role}`]}</div>}
                </div>
            </div>
            <div className="flex items-center gap-[24px] mr-[16px]">{actionsElement}</div>
        </div>
    );
}
