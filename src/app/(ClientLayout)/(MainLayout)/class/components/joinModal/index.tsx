import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Form from '~/components/Form';
import Input from '~/components/Input';
import { joinClassValueRule, requiredRule } from '~/components/Input/rules';
import Modal from '~/components/Modal';

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
                    <Input
                        label="Nhập link hoặc class ID"
                        rules={[requiredRule, joinClassValueRule]}
                        onChange={setClassJoin}
                        value={classJoin}
                    />
                </Form>
            </div>
        </Modal>
    );
}
