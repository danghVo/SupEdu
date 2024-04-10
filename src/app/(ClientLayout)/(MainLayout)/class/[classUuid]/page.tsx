'use client';

import { redirect, usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';

import { ClassController } from '~/controller/class.controller';
import { requiredRule } from '~/components/Input/rules';
import Input from '~/components/Input';
import Button from '~/components/Button';
import Avatar from '~/components/Avatar';
import Loading from '~/components/Loading';
import { useProfile, useClass } from '~/hooks';
import { NotificationTheme } from '../../layout';
import { NotificationType } from '~/components/Notification';

export default function Page({ params: { classUuid } }: { params: { classUuid: string } }) {
    const [password, setPassword] = useState({
        value: '',
        open: false,
    });
    const pathName = usePathname();
    const queryClient = useQueryClient();
    const { data: classData, isSuccess: isClassSuccess, refetch, isRefetching } = useClass(classUuid);
    const { data: user, isSuccess: isUserSuccess } = useProfile();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const notificationShow = useContext(NotificationTheme);
    const { mutateAsync } = useMutation({
        mutationFn: (password: string) => {
            setLoading(true);
            setError('');
            const classController = new ClassController();
            return classController.joinClass(classUuid, password);
        },
        onSuccess: (data) => {
            setLoading(false);
            if (data.error) {
                setError(data.error);
                notificationShow(data.error, NotificationType.error);
            } else {
                if (data.status === 'JOINED') {
                    notificationShow('Tham gia lớp học thành công', NotificationType.success);
                }
                queryClient.invalidateQueries({
                    queryKey: ['class', classUuid],
                });
            }
        },
        onError: () => {
            setLoading(false);
            setError('Lỗi hệ thống');
        },
    });

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (isClassSuccess && isUserSuccess) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                socket.on(`${user.uuid}/addToClass`, () => {
                    refetch();
                });

                socket.on(`${user.uuid}/requestClass`, () => {
                    refetch();
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [isClassSuccess, isUserSuccess]);

    const handleJoinClass = async () => {
        const hasPassword = true;
        if (hasPassword && !password.open && classData.isPassword) {
            setPassword((prev) => ({ ...prev, open: true }));
        } else {
            mutateAsync(password.value);
        }
    };

    if (isClassSuccess && !isRefetching && (classData.status === 'JOINED' || classData.isOwner)) {
        redirect(pathName + '/post');
    }

    return isClassSuccess && !isRefetching ? (
        classData.error ? (
            <div className="h-full flex items-center justify-center text-[24px] font-bold">Không tìm thấy lớp</div>
        ) : (
            <div className="grow h-full flex flex-col justify-center items-center mb-[32px]">
                <Avatar userInfor={classData.owner} className="w-[60px] h-[60px]" />
                <div className="font-bold text-[32px] mt-[12px]">{classData.name}</div>
                <div className="font-semibold text-[18px]  mb-[12px]">{classData.description}</div>
                <div className="text-[18px]">Bạn chưa tham gia lớp học này</div>

                {error && (
                    <div className="bg-red-100 text-red-400 w-[400px] mt-[12px] p-[12px] rounded-lg text-center">
                        {error}
                    </div>
                )}

                <div className="flex items-start gap-[16px] mt-[12px]">
                    <Button
                        handleClick={handleJoinClass}
                        disabled={classData.status === 'PENDING' || loading}
                        className={`rounded-lg bg-blue-400 text-white w-[150px]`}
                        theme=""
                    >
                        {loading ? (
                            <Loading className="text-[12px]" />
                        ) : classData.status === 'UNJOINED' ? (
                            'Tham gia'
                        ) : (
                            'Chờ xác nhận'
                        )}
                    </Button>
                    {password.open && (
                        <Input
                            value={password.value}
                            placeholder="Nhập mật khẩu"
                            reset={false}
                            inputType="password"
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
