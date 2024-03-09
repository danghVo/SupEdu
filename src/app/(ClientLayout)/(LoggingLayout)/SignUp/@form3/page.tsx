'use client';

import Image from 'next/image';
import { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCircleCheck, faCircleNotch, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import { motion } from 'framer-motion';

import Form from '~/components/Form';
import image from '~/assets/image';
import InputRatio from '~/components/Input/InputRatio';
import { SignUpFormProps } from '../@form1/page';
import { FormController } from '../layout';
import { UserController } from '~/controller';

export default function Page() {
    const { onBackward, onForward, formData, onChange }: SignUpFormProps = useContext(FormController);
    const queryClient = useQueryClient(new QueryClient());
    const [error, setError] = useState('');
    const [waitingRecevieVerify, setWaitingRecevieVerify] = useState(true);
    const [isSuccess, setIsSuccess] = useState<null | boolean>(null);
    const router = useRouter();

    const handleSubmit = async () => {
        const userController = new UserController();

        const data = await queryClient.fetchQuery({
            queryKey: [formData],
            queryFn: () => userController.signUp(formData),
        });

        if (data.error) {
            setError(data.error);
        } else {
            setWaitingRecevieVerify(true);
            const socket = io('localhost:4000');

            setTimeout(
                () => {
                    setError('Chưa nhận được xác nhận, vui lòng thử lại sau');
                    socket.disconnect();
                    handleFail();
                },
                1000 * 60 * 5,
            );

            socket.on('verify', (status) => {
                if (status === 'success') {
                    socket.disconnect();
                    handleSuccess();
                } else if (status == 'fail') {
                    socket.disconnect();
                    setError('Đã có lỗi xảy ra, vui lòng thử lại sau');
                    handleFail();
                }
            });
        }
    };

    const handleSuccess = () => {
        setIsSuccess(true);
        setTimeout(() => {
            setWaitingRecevieVerify(false);
            router.push('/SignIn');
        }, 5000);
    };

    const handleFail = () => {
        setIsSuccess(false);
        setTimeout(() => {
            setWaitingRecevieVerify(false);
            router.push('/SignIn');
        }, 5000);
    };

    return waitingRecevieVerify ? (
        <motion.div className="h-[400px] flex flex-col justify-center items-center">
            {typeof isSuccess === 'boolean' ? (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <FontAwesomeIcon
                            icon={isSuccess ? faCircleCheck : faCircleXmark}
                            className={`${isSuccess ? 'text-green-500' : 'text-red-500'} h-[100px]`}
                        />
                    </motion.div>
                    <div className="mt-[24px] text-[20px] font-semibold">
                        {isSuccess ? 'Đăng ký thành công' : error}
                    </div>
                </>
            ) : (
                <>
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, type: 'tween', ease: 'linear' }}
                    >
                        <FontAwesomeIcon icon={faCircleNotch} className="h-[100px]" />
                    </motion.div>
                    <div className="mt-[24px] text-[20px] font-semibold">Hãy xác nhận mail của bạn</div>
                </>
            )}
        </motion.div>
    ) : (
        <>
            <div className="w-full cursor-pointer" onClick={() => onBackward()}>
                <FontAwesomeIcon icon={faCaretLeft} className="text-[32px] ml-[32px]" />
            </div>
            <Form
                handleSubmit={handleSubmit}
                className="w-full"
                errMessage={{ message: error }}
                submit={{ content: 'Hoàn thành', custom: 'rounded-full ' }}
            >
                <InputRatio
                    selectionData={[
                        {
                            value: 'TEACHER',
                            ui: (
                                <div className="mx-2 flex items-center gap-4 text-[18px]">
                                    <Image src={image.teacher} alt={'Giáo viên'} className="w-[30px]" /> Giáo viên
                                </div>
                            ),
                        },
                        {
                            value: 'STUDENT',
                            ui: (
                                <div className="mx-2 flex items-center gap-4 text-[18px]">
                                    <Image src={image.student} alt={'Học sinh'} className="w-[30px]" /> Học sinh
                                </div>
                            ),
                        },
                    ]}
                    value={formData}
                    onChange={(value) =>
                        onChange({
                            ...formData,
                            role: value,
                        })
                    }
                    label={'Bạn là'}
                />
            </Form>
        </>
    );
}
