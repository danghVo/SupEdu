'use client';
import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';
import Link from 'next/link';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';

import Input from '~/components/Input';
import Form from '~/components/Form';
import image from '~/assets/image';
import { UserController } from '~/controller';
import { useState } from 'react';
import { requiredRule } from '~/components/Input/rules';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        const userController = new UserController();

        const data = await queryClient.fetchQuery({
            queryKey: ['user'],
            queryFn: () => userController.signIn({ email, password }),
        });

        queryClient.setQueryData(['user'], data);
        console.log(queryClient.getQueryData(['user']));

        if (data.error) {
            setError(data.error);
        } else router.push('/class');
    };

    return (
        <div className="shadow-custom-3 flex overflow-hidden h-[80vh] w-[1200px] rounded-[50px] bg-[rgb( 225, 230, 220)]/[.1]">
            <Image src={image.signIn} className="w-[50%]" alt="background" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grow flex items-center justify-center flex-col"
            >
                <div className="text-center flex justify-between  w-full px-12">
                    <div className="text-[18px] font-semibold">Đăng nhập</div>
                    <div>
                        Bạn chưa có tài khoản?{' '}
                        <Link href={'./SignUp'} className="text-[18px] font-semibold cursor-pointer underline">
                            Đăng ký
                        </Link>
                    </div>
                </div>
                <Form
                    handleSubmit={handleSubmit}
                    className="w-full"
                    errMessage={{ message: error }}
                    submit={{ content: 'Đăng nhập', custom: 'rounded-full ' }}
                >
                    <Input
                        value={email}
                        rules={[requiredRule]}
                        onChange={setEmail}
                        label="Email"
                        placeholder="example@gmail.com"
                    />
                    <Input
                        value={password}
                        rules={[requiredRule]}
                        onChange={setPassword}
                        label="Mật khẩu"
                        inputType="password"
                        placeholder="Mật khẩu"
                    />
                </Form>
                <div className="flex items-center">
                    Đăng nhập với:{' '}
                    <Image width={30} className="ml-[8px] cursor-pointer" src={image.google} alt="Google Icon" />
                </div>
            </motion.div>
        </div>
    );
}
