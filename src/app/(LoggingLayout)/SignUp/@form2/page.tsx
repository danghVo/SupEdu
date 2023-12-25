'use client';

import Image from 'next/image';

import Form from '~/components/Form';
import Input from '~/components/Input';
import image from '~/assets/image';
import InputOption from '~/components/Input/InputOption';

export default function page() {
    return (
        <>
            <Form handleSubmit={() => {}} className="w-full" submit={{ content: 'Tiếp tục', custom: 'rounded-full ' }}>
                <Input value={''} onChange={() => {}} label="Họ Tên" placeholder="Họ Tên" />
                <Input value={''} onChange={() => {}} label="Tuổi" inputType="number" />
                <InputOption value={''} onChange={() => {}} optionData={['Việt Nam', 'Hoa Kỳ']} label="Nơi sinh sống" />
            </Form>
        </>
    );
}
