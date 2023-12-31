'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

import Input from '~/components/Input';
import Form from '~/components/Form';
import image from '~/assets/image';
import Link from 'next/link';

export default function Page() {
    return (
        <div className="shadow-custom-3 flex overflow-hidden h-[80vh] w-[1000px] rounded-[50px] bg-[rgb( 225, 230, 220)]/[.1]">
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
                    handleSubmit={() => {}}
                    className="w-full"
                    submit={{ content: 'Đăng nhập', custom: 'rounded-full ' }}
                >
                    <Input value={''} onChange={() => {}} label="Email" placeholder="example@gmail.com" />
                    <Input
                        value={''}
                        onChange={() => {}}
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
