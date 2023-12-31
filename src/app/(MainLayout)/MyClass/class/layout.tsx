import React from 'react';

export default function MyClassLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-[24px] py-[32px]">
            <div className="font-bold text-[32px] ">Các lớp học của bạn</div>
            <div className="mx-[12px]">{children}</div>
        </div>
    );
}
