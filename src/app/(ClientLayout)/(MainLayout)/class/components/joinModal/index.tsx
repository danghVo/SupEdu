import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Form from '~/components/Form';
import Input from '~/components/Input';
import Modal from '~/components/Modal';
import { ClassController } from '~/controller/class.controller';

export default function JoinModal({ handleCloseModal }: { handleCloseModal: () => void }) {
    const [classJoin, setClassJoin] = useState<string>('');
    const router = useRouter();

    const handleSubmit = () => {
        if (classJoin.includes('/class/')) {
            router.replace(classJoin);
        } else router.push(`/class/${classJoin}`);
    };

    return (
        <Modal handleCloseModal={handleCloseModal} width={'w-[400px]'} height={'h-[fit]'}>
            <div className="pt-[16px]">
                <div className="text-center font-bold text-[24px]">Tham gia lớp</div>
                <Form handleSubmit={handleSubmit} submit={{ content: 'Tham gia lớp', custom: 'w-full' }}>
                    <Input label="Nhập link hoặc class ID" onChange={setClassJoin} value={classJoin} />
                </Form>
            </div>
        </Modal>
    );
}
