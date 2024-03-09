'use client';

import { useContext } from 'react';

import Form from '~/components/Form';
import Input from '~/components/Input';
import { SignUpFormProps } from '../@form1/page';
import { FormController } from '../layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { requiredRule } from '~/components/Input/rules';
import minValueRule from '~/components/Input/rules/minValueRule';

export default function Page() {
    const { onBackward, onForward, formData, onChange }: SignUpFormProps = useContext(FormController);

    return (
        <>
            <div className="w-full cursor-pointer mb-[-12px]" onClick={() => onBackward()}>
                <FontAwesomeIcon icon={faCaretLeft} className="text-[32px] ml-[32px]" />
            </div>
            <Form handleSubmit={onForward} className="w-full" submit={{ content: 'Tiếp tục', custom: 'rounded-full ' }}>
                <Input
                    rules={[requiredRule]}
                    value={formData.name}
                    onChange={(value) =>
                        onChange({
                            ...formData,
                            name: value,
                        })
                    }
                    label="Họ Tên"
                    placeholder="Họ Tên"
                />
                <Input
                    rules={[requiredRule, minValueRule(18)]}
                    value={formData.age}
                    onChange={(value) =>
                        onChange({
                            ...formData,
                            age: parseInt(value),
                        })
                    }
                    label="Tuổi"
                    placeholder="20"
                    inputType="number"
                />
            </Form>
        </>
    );
}
