import { useContext, useState } from 'react';

import Form from '~/components/Form';
import Input from '~/components/Input';
import Loading from '~/components/Loading';
import Modal from '~/components/Modal';
import { minLengthRule, passwordRule, requiredRule, sameValueRule } from '~/components/Input/rules';
import { UserController } from '~/controller';
import { NotificationTheme } from '../../../layout';
import { NotificationType } from '~/components/Notification';

export default function ChangePasswordModal({ handleCloseModal }: { handleCloseModal: () => void }) {
    const [data, setData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const notificationShow = useContext(NotificationTheme);

    const handleSubmit = async () => {
        if (data.oldPassword === data.newPassword) {
            setError('Mật khẩu mới không được trùng với mật khẩu cũ');
            return;
        }

        const userController = new UserController();
        setLoading(true);

        const res = await userController.changePassword(data.oldPassword, data.newPassword, data.confirmPassword);

        setLoading(false);
        if (!res.error) {
            handleCloseModal();
            notificationShow('Đổi mật khẩu thành công', NotificationType.success);
        } else {
            setError(res.error);
        }
    };

    return (
        <Modal handleCloseModal={handleCloseModal} width={'w-[500px]'} height={'h-fit'}>
            <div className="text-[32px] font-bold text-center mt-[32px]">Đổi mật khẩu</div>
            <Form
                handleSubmit={handleSubmit}
                errMessage={{ message: error }}
                submit={{
                    content: loading ? <Loading className="text-[32px]" /> : 'Xác nhận',
                    custom: 'mt-[0] w-full',
                    loading,
                }}
                className="flex flex-col items-center justify-center gap-[16px] px-[64px] min-w-[500px]"
            >
                <Input
                    inputType="password"
                    value={data.oldPassword}
                    rules={[requiredRule]}
                    onChange={(value) => {
                        setData({ ...data, oldPassword: value });
                    }}
                    classNameWrapper="w-[350px]"
                    placeholder="Mật khẩu cũ"
                />
                <Input
                    inputType="password"
                    value={data.newPassword}
                    rules={[requiredRule, passwordRule, minLengthRule(8)]}
                    onChange={(value) => {
                        setData({ ...data, newPassword: value });
                    }}
                    classNameWrapper="w-[350px]"
                    placeholder="Mật khẩu mới"
                />
                <Input
                    inputType="password"
                    value={data.confirmPassword}
                    rules={[requiredRule, sameValueRule(data.newPassword, 'Không trùng khớp mật khẩu mới')]}
                    onChange={(value) => {
                        setData({ ...data, confirmPassword: value });
                    }}
                    classNameWrapper="w-[350px]"
                    placeholder="Nhập lại mật khẩu mới"
                />
            </Form>
        </Modal>
    );
}
