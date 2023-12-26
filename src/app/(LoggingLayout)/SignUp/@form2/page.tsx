'use client';

import { useContext } from 'react';

import Form from '~/components/Form';
import Input from '~/components/Input';
import InputOption from '~/components/Input/InputOption';
import { SignUpFormProps } from '../@form1/page';
import { FormController } from '../layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

export default function Page() {
    const { onBackward, onForward }: SignUpFormProps = useContext(FormController);

    return (
        <>
            <div className="w-full cursor-pointer mb-[-12px]" onClick={onBackward}>
                <FontAwesomeIcon icon={faCaretLeft} className="text-[32px] ml-[32px]" />
            </div>
            <Form handleSubmit={() => {}} className="w-full" submit={{ content: 'Tiếp tục', custom: 'rounded-full ' }}>
                <Input value={''} onChange={() => {}} label="Họ Tên" placeholder="Họ Tên" />
                <Input value={''} onChange={() => {}} label="Tuổi" inputType="number" />
                <InputOption value={''} onChange={() => {}} optionData={['Việt Nam', 'Hoa Kỳ']} label="Nơi sinh sống" />
            </Form>
        </>
    );
}
