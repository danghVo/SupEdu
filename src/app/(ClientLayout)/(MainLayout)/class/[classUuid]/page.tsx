'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { requiredRule } from '~/components/Input/rules';
import { ClassController } from '~/controller/class.controller';
import images from '~/assets/image';
import Avatar from '~/components/Avatar';
import useProfile from '~/hooks/useProfile';
import useClass from '~/hooks/useClass';
import Loading from '~/components/Loading/intex';

export default function Page({ params: { classUuid } }: { params: { classUuid: string } }) {
    const [password, setPassword] = useState({
        value: '',
        open: false,
    });
    const pathName = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: user, isSuccess: isUserSuccess } = useProfile();
    const { data: classData, isSuccess: isClassSuccess, isFetched } = useClass(classUuid);
    const { mutateAsync } = useMutation({
        mutationFn: (password: string) => {
            const classController = new ClassController();
            return classController.joinClass(classUuid, password);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['class', classUuid],
            });
        },
    });

    const handleJoinClass = () => {
        const hasPassword = true;
        if (hasPassword && !password.open && classData.isPassword) {
            setPassword((prev) => ({ ...prev, open: true }));
        } else {
            mutateAsync(password.value);
        }
    };

    return isClassSuccess && isUserSuccess ? (
        classData.error ? (
            <div className="h-full flex items-center justify-center text-[24px] font-bold">Không tìm thấy lớp</div>
        ) : classData.status === 'JOINED' || user.uuid === classData.owner.uuid ? (
            router.push(pathName + '/post')
        ) : (
            <div className="grow h-full flex flex-col justify-center items-center mb-[32px]">
                <Avatar userInfor={classData.owner} className="w-[60px] h-[60px]" />
                <div className="font-bold text-[32px] mt-[12px]">{classData.name}</div>
                <div className="font-semibold text-[18px]  mb-[12px]">{classData.description}</div>
                <div className="text-[18px]">Bạn chưa tham gia lớp học này</div>

                <div className="flex items-start gap-[16px] mt-[12px]">
                    <Button
                        handleClick={handleJoinClass}
                        disabled={classData.status === 'PENDING'}
                        className="rounded-lg bg-blue-400 text-white w-[150px]"
                        theme=""
                    >
                        {classData.status === 'UNJOINED' ? 'Tham gia' : 'Chờ xác nhận'}
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
        )
    ) : (
        <Loading />
    );
}
