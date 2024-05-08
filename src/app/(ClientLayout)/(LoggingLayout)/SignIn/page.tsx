'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

import Input from '~/components/Input';
import Form from '~/components/Form';
import { UserController } from '~/controller';
import { useState } from 'react';
import { requiredRule } from '~/components/Input/rules';
import { useRouter } from 'next/navigation';
import Loading from '~/components/Loading';
import { useQueryClient } from '@tanstack/react-query';
import emailRule from '~/components/Input/rules/emailRule';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        setError('');
        const userController = new UserController();

        setLoading(true);
        const data = await userController.signIn({ email, password });

        if (data.error) {
            if (typeof data.error === 'object') {
                data.error = data.error[0];
            }

            setError(data.error);
        } else {
            await queryClient.invalidateQueries({
                queryKey: ['profile'],
            });
            router.push('/class');
        }
        setLoading(false);
    };

    return (
        <div className="shadow-custom-3 flex overflow-hidden h-[80vh] w-[1200px] rounded-[50px] bg-[rgb( 225, 230, 220)]/[.1]">
            <Image src="/image/SignIn.png" width={600} height={600} alt="background" />
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
                    className={`w-full`}
                    errMessage={{ message: error }}
                    submit={{
                        content: loading ? <Loading className="text-white text-[32px]" /> : 'Đăng nhập',
                        custom: 'rounded-full',
                        loading,
                    }}
                >
                    <Input
                        value={email}
                        rules={[requiredRule, emailRule]}
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
            </motion.div>
        </div>
    );
}
