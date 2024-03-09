'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { requiredRule } from '~/components/Input/rules';

let role = '';

export default function Page({ params: { classId } }: { params: { classId: string } }) {
    const [password, setPassword] = useState({
        value: '',
        open: false,
    });
    const pathName = usePathname();
    const router = useRouter();

    const handleJoinClass = () => {
        const hasPassword = true;
        if (hasPassword && !password.open) {
            setPassword((prev) => ({ ...prev, open: true }));
        } else {
            // submit join class
            router.replace(pathName + '/post');
        }
    };

    return role === 'nonparticipating' ? (
        <div className="grow h-full flex flex-col justify-center items-center mb-[32px]">
            <div className="font-bold text-[32px] mb-[12px]">Lớp A</div>
            <div className="text-[18px]">Bạn chưa tham gia lớp học này</div>

            <div className="flex items-start gap-[16px] mt-[12px]">
                <Button handleClick={handleJoinClass} className="rounded-lg bg-blue-400 text-white w-[150px]" theme="">
                    Tham gia ngay
                </Button>
                {password.open && (
                    <Input
                        value={password.value}
                        placeholder="Nhập mật khẩu"
                        reset={false}
                        rules={[requiredRule]}
                        classNameWrapper="rounded-xl h-[40px]"
                        onChange={(value) => {
                            setPassword((prev) => ({ ...prev, value }));
                        }}
                    />
                )}
            </div>
        </div>
    ) : (
        router.replace(pathName + '/post')
    );
}
