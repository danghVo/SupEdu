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
import InputRatio from '~/components/Input/InputRatio';
import { SignUpFormProps } from '../@form1/page';
import { FormController } from '../layout';
import { UserController } from '~/controller';
import Loading from '~/components/Loading';

export default function Page() {
    const { onBackward, onForward, formData, onChange }: SignUpFormProps = useContext(FormController);
    const queryClient = useQueryClient(new QueryClient());
    const [error, setError] = useState('');
    const [waitingRecevieVerify, setWaitingRecevieVerify] = useState(false);
    const [isSuccess, setIsSuccess] = useState<null | boolean>(null);
    const [currentUuid, setCurrnetUuid] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.role) {
            setError('Vui lòng chọn vai trò');
            return;
        }

        setLoading(true);

        const userController = new UserController();

        const data = await queryClient.fetchQuery({
            queryKey: [formData],
            queryFn: () => userController.signUp(formData),
        });

        setLoading(false);

        if (data.error) {
            setError(data.error);
        } else {
            setCurrnetUuid(data.uuid);
            setWaitingRecevieVerify(true);
            const socket = io('http://localhost:4000');
            socket.on('connect', () => {
                socket.on('verify', (payload) => {
                    if (payload.status === 'success') {
                        socket.disconnect();
                        handleSuccess();
                    }
                });
            });

            setTimeout(
                () => {
                    setError('Chưa nhận được xác nhận, vui lòng thử lại sau');
                    socket.disconnect();
                    handleFail();
                },
                1000 * 60 * 5,
            );
        }
    };

    const handleResendVerifyMail = async () => {
        const userController = new UserController();

        const data = await queryClient.fetchQuery({
            queryKey: [currentUuid],
            queryFn: () => userController.resendVerifyMail(currentUuid),
        });

        if (data.error) {
            setError(data.error);
            handleFail();
        }
    };

    const handleSuccess = () => {
        setIsSuccess(true);
    };

    const handleFail = () => {
        setIsSuccess(false);
    };

    return (
        <>
            <div className="w-full cursor-pointer" onClick={() => onBackward()}>
                <FontAwesomeIcon icon={faCaretLeft} className="text-[32px] ml-[32px]" />
            </div>
            {waitingRecevieVerify ? (
                <motion.div className="h-[400px] flex flex-col justify-center items-center">
                    {typeof isSuccess === 'boolean' ? (
                        <>
                            <motion.div key={'Done'} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <FontAwesomeIcon
                                    style={{ height: 100 }}
                                    icon={isSuccess ? faCircleCheck : faCircleXmark}
                                    className={`${isSuccess ? 'text-green-500' : 'text-red-500'}`}
                                />
                            </motion.div>
                            <div className="mt-[24px] text-[20px] font-semibold">
                                {isSuccess ? 'Đăng ký thành công' : error}
                            </div>
                            {!isSuccess && (
                                <div
                                    className="mt-[12px] text-[20px] font-semibold underline cursor-pointer"
                                    onClick={() => onBackward(0)}
                                >
                                    Đăng ký lại
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <motion.div
                                key={'Loading'}
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, type: 'tween', ease: 'linear' }}
                            >
                                <FontAwesomeIcon icon={faCircleNotch} style={{ height: 100 }} />
                            </motion.div>
                            <div className="mt-[24px] text-[20px] font-semibold">Hãy xác nhận mail của bạn</div>
                            <div className="mt-[24px] text-[20px] font-semibold">
                                Chưa nhận được mail ?{' '}
                                <span onClick={handleResendVerifyMail} className="underline cursor-pointer font-bold">
                                    Gửi lại
                                </span>
                            </div>
                        </>
                    )}
                </motion.div>
            ) : (
                <>
                    <Form
                        handleSubmit={handleSubmit}
                        className="w-full"
                        errMessage={{ message: error }}
                        // submit={{ content: 'Hoàn thành', custom: 'rounded-full ' }}
                        submit={{
                            content: loading ? <Loading className="text-[32px]" /> : 'Hoàn thành',
                            custom: 'rounded-full',
                            loading,
                        }}
                    >
                        <InputRatio
                            selectionData={[
                                {
                                    value: 'TEACHER',
                                    ui: (
                                        <div className="mx-2 flex items-center gap-4 text-[18px]">
                                            <Image src="/image/teacher.png" alt={'Giáo viên'} width={30} height={30} /> Giáo
                                            viên
                                        </div>
                                    ),
                                },
                                {
                                    value: 'STUDENT',
                                    ui: (
                                        <div className="mx-2 flex items-center gap-4 text-[18px]">
                                            <Image src="/image/student.png" alt={'Học sinh'} width={30} height={30} /> Học sinh
                                        </div>
                                    ),
                                },
                            ]}
                            value={formData.role}
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
            )}
        </>
    );
}
