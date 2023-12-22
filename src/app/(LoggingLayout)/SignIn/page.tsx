'use client';

import Form from '~/components/Form';
import Input from '~/components/Input';

export default function Page() {
    return (
        <div className="shadow-custom-1 rounded-xl bg-slate-200/[.1]">
            <div className=""></div>
            <Form handleSubmit={() => {}} header="Đăng Nhập" submit={{ content: 'Đăng nhập' }}>
                <Input value={''} onChange={() => {}} label="Email" placeholder="example@gmail.com" />
                <Input value={''} onChange={() => {}} label="Mật khẩu" inputType="password" placeholder="Mật khẩu" />
            </Form>
        </div>
    );
}
