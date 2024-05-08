'use client';

import Form from '~/components/Form';
import Input from '~/components/Input';
import { useContext } from 'react';
import { FormController } from '../layout';
import { passwordRule, requiredRule, sameValueRule } from '~/components/Input/rules';
import emailRule from '~/components/Input/rules/emailRule';

export interface SignUpFormProps {
    onBackward: (formIndex?: number) => void;
    onForward: (formIndex?: number) => void;
    formData: any;
    onChange: (args?: any) => void;
}

export default function Page() {
    const { onForward, formData, onChange }: SignUpFormProps = useContext(FormController);

    return (
        <Form handleSubmit={onForward} className="w-full" submit={{ content: 'Tiếp tục', custom: 'rounded-full ' }}>
            <Input
                value={formData.email}
                rules={[requiredRule, emailRule]}
                onChange={(value) =>
                    onChange({
                        ...formData,
                        email: value,
                    })
                }
                label="Email"
                placeholder="example@gmail.com"
            />
            <Input
                rules={[requiredRule, passwordRule]}
                value={formData.password}
                onChange={(value) =>
                    onChange({
                        ...formData,
                        password: value,
                    })
                }
                label="Mật khẩu"
                inputType="password"
                placeholder="Mật khẩu"
            />
            <Input
                value={formData.confirmPassword}
                rules={[requiredRule, passwordRule, sameValueRule(formData.password, 'Mật khẩu không khớp')]}
                onChange={(value) =>
                    onChange({
                        ...formData,
                        confirmPassword: value,
                    })
                }
                label="Nhập lại mật khẩu"
                inputType="password"
                placeholder="Nhập lại mật khẩu"
            />
        </Form>
    );
}
