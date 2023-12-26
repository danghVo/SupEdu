'use client';

import Image from 'next/image';

import Form from '~/components/Form';
import Input from '~/components/Input';
import image from '~/assets/image';
import { useContext } from 'react';
import { FormController } from '../layout';
import Link from 'next/link';

export interface SignUpFormProps {
    onBackward: () => void;
    onForward: () => void;
}

export default function Page() {
    const { onBackward, onForward }: SignUpFormProps = useContext(FormController);
    return (
        <>
            <div className="text-center flex justify-between  w-full px-12">
                <div className="text-[18px] font-semibold">Đăng ký</div>
                <div>
                    Bạn đã có tài khoản?{' '}
                    <Link href={'./SignIn'} className="text-[18px] font-semibold cursor-pointer underline">
                        Đăng nhập
                    </Link>
                </div>
            </div>
            <Form handleSubmit={() => {}} className="w-full" submit={{ content: 'Tiếp tục', custom: 'rounded-full ' }}>
                <Input value={''} onChange={() => {}} label="Email" placeholder="example@gmail.com" />
                <Input value={''} onChange={() => {}} label="Mật khẩu" inputType="password" placeholder="Mật khẩu" />
                <Input
                    value={''}
                    onChange={() => {}}
                    label="Nhập lại mật khẩu"
                    inputType="password"
                    placeholder="Nhập lại mật khẩu"
                />
            </Form>
        </>
    );
}
