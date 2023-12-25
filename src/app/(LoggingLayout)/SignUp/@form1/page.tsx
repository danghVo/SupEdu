'use client';

import Image from 'next/image';

import Form from '~/components/Form';
import Input from '~/components/Input';
import image from '~/assets/image';

export default function page() {
    return (
        <>
            <div className="text-center flex justify-between  w-full px-12">
                <div className="text-[18px] font-semibold">Đăng ký</div>
                <div>
                    Bạn đã có tài khoản?{' '}
                    <span className="text-[18px] font-semibold cursor-pointer underline">Đăng nhập</span>
                </div>
            </div>
            <Form handleSubmit={() => {}} className="w-full" submit={{ content: 'Đăng ký', custom: 'rounded-full ' }}>
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
