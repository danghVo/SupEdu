'use client';

import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { requiredRule } from '~/components/Input/rules';
import { ClassController } from '~/controller/class.controller';
import images from '~/assets/image';
import Avatar from '~/components/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Page({ params: { classUuid } }: { params: { classUuid: string } }) {
    const [password, setPassword] = useState({
        value: '',
        open: false,
    });
    const [isJoined, setIsJoined] = useState(false);
    const [preClassData, setPreClassData] = useState({
        name: '',
        description: '',
        owner: {
            name: '',
            email: '',
            avatar: '',
        },
        status: '',
        isPassword: false,
    });
    const pathName = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        fetchClass();
    }, []);

    const fetchClass = async () => {
        const classController = new ClassController();

        const data = await queryClient.fetchQuery({
            queryKey: ['class', classUuid],
            queryFn: () => classController.getClass(classUuid),
        });

        if (data.error) {
        } else {
            if (data.status === 'UNJOINED') {
                setPreClassData({
                    name: data.name as string,
                    description: data.description as string,
                    owner: {
                        name: data.owner.name as string,
                        email: data.owner.email as string,
                        avatar: data.owner.avatar ? data.owner.avatar : images.teacher,
                    },
                    status: data.status as string,
                    isPassword: data.isPassword as boolean,
                });
            } else router.push(pathName + '/post');
        }
    };

    const handleJoinClass = () => {
        const hasPassword = true;
        if (hasPassword && !password.open && preClassData.isPassword) {
            setPassword((prev) => ({ ...prev, open: true }));
        } else {
            fetchJoinClass();
        }
    };

    const fetchJoinClass = async () => {
        const classController = new ClassController();
        const data = await queryClient.fetchQuery({
            queryKey: ['join class'],
            queryFn: () => classController.joinClass(classUuid, password.value),
        });

        if (data.error) {
        } else {
            if (data.status === 'JOINED') {
                router.replace(pathName + '/post');
            } else {
                setPreClassData((prev) => ({ ...prev, status: data.status as string }));
            }
        }
    };

    return preClassData.status === '' ? (
        <></>
    ) : (
        // <Suspense fallback={<div>...Loading</div>}>
        //     <motion.div
        //         initial={{ opacity: 0, rotate: 0 }}
        //         animate={{ opacity: 1, rotate: 360 }}
        //         transition={{ type: 'tween' }}
        //         className="grow h-full flex flex-col justify-center items-center mb-[32px] h-[40px]"
        //     >
        //         <FontAwesomeIcon icon={faCircleNotch} />
        //     </motion.div>
        // </Suspense>
        <div className="grow h-full flex flex-col justify-center items-center mb-[32px]">
            {preClassData.owner.avatar && <Avatar userInfor={preClassData.owner} className="w-[60px] h-[60px]" />}
            <div className="font-bold text-[32px] mt-[12px]">{preClassData.name}</div>
            <div className="font-semibold text-[18px]  mb-[12px]">{preClassData.description}</div>
            <div className="text-[18px]">Bạn chưa tham gia lớp học này</div>

            <div className="flex items-start gap-[16px] mt-[12px]">
                <Button
                    handleClick={handleJoinClass}
                    disabled={preClassData.status === 'Pending'}
                    className="rounded-lg bg-blue-400 text-white w-[150px]"
                    theme=""
                >
                    {preClassData.status === 'UNJOINED' ? 'Tham gia' : 'Chờ xác nhận'}
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
    );
}
