import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useQueryClient } from '@tanstack/react-query';

import { ClassController } from '~/controller/class.controller';
import Form from '~/components/Form';
import { requiredRule } from '~/components/Input/rules';
import Input from '~/components/Input';
import InputFile from '~/components/Input/InputFile';
import Modal from '~/components/Modal';
import InputCheckbox from '~/components/Input/InputCheckbox';

export interface FormData {
    name: string;
    description: string;
    password: string;
    requireApprove: boolean;
    theme: {
        to: string;
        from: string;
    };
    background: File | null;
}

export default function CreateClassModal({
    handleCloseModal,
    refetchClass,
}: {
    handleCloseModal: () => void;
    refetchClass: (filter: string) => void;
}) {
    const [openColorPicker, setOpenColorPicker] = useState({
        from: false,
        to: false,
    });
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        password: '',
        requireApprove: false,
        theme: {
            from: '#000000',
            to: '#000000',
        },
        background: null,
    });
    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        const user: { uuid: string } | undefined = queryClient.getQueryData(['user']);

        const theme = `from-[${formData.theme.from}] to-[${formData.theme.to}]`;

        if (user) {
            const classController = new ClassController();
            const data = await queryClient.fetchQuery({
                queryKey: ['create class'],
                queryFn: () => classController.createClass(formData, user.uuid),
            });

            if (!data.error) {
                refetchClass('Sở hữu');

                handleCloseModal();
            }
        }
    };

    return (
        <Modal handleCloseModal={handleCloseModal} height={'h-fit'} width={'w-fit'}>
            <Form handleSubmit={handleSubmit} submit={{ content: 'Tạo', custom: 'mt-[16px]' }}>
                <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
                    <div className="text-center text-[24px] font-bold mb-[8px]">Lớp mới</div>
                    <Input
                        label="Tên lớp"
                        type="inline"
                        rules={[requiredRule]}
                        classNameWrapper="h-[40px] mt-[12px]"
                        value={formData.name}
                        onChange={(value) => {
                            setFormData({
                                ...formData,
                                name: value,
                            });
                        }}
                    />
                    <Input
                        label="Mô tả"
                        type="inline"
                        classNameWrapper="h-[40px] mt-[12px]"
                        value={formData.description}
                        onChange={(value) => {
                            setFormData({
                                ...formData,
                                description: value,
                            });
                        }}
                    />
                    <Input
                        label="Mật khẩu"
                        type="inline"
                        inputType="password"
                        classNameWrapper="h-[40px] mt-[12px]"
                        value={formData.password}
                        onChange={(value) => {
                            setFormData({
                                ...formData,
                                password: value,
                            });
                        }}
                    />
                    <InputCheckbox
                        className="flex gap-[32px] ml-[12px] mt-[12px]"
                        label="Yêu cầu phê duyệt"
                        value={formData.requireApprove}
                        onChange={(choose) => {
                            setFormData({
                                ...formData,
                                requireApprove: choose,
                            });
                        }}
                    />
                    <div className="flex px-[12px] mt-[16px] items-center">
                        <div className="w-[100px] font-semibold">Nền</div>
                        <div className="grow flex items-center justify-center relative">
                            <div
                                className={`w-[40px] h-[40px] cursor-pointer rounded-l-lg relative`}
                                onClick={() => {
                                    setOpenColorPicker({
                                        to: false,
                                        from: !openColorPicker.from,
                                    });
                                }}
                                style={{ backgroundColor: formData.theme.from }}
                            >
                                {openColorPicker.from && (
                                    <HexColorPicker
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className="absolute top-[110%] left-0 w-full h-full z-10"
                                        color={formData.theme.from}
                                        onChange={(color) => {
                                            setFormData({
                                                ...formData,
                                                theme: {
                                                    ...formData.theme,
                                                    from: color,
                                                },
                                            });
                                        }}
                                    />
                                )}
                            </div>
                            <div
                                className={`w-[40px] h-[40px] cursor-pointer rounded-r-lg relative`}
                                onClick={() => {
                                    setOpenColorPicker({
                                        from: false,
                                        to: !openColorPicker.to,
                                    });
                                }}
                                style={{ backgroundColor: formData.theme.to }}
                            >
                                {openColorPicker.to && (
                                    <HexColorPicker
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className="absolute top-[110%] left-0 w-full h-full z-10"
                                        color={formData.theme.to}
                                        onChange={(color) => {
                                            setFormData({
                                                ...formData,
                                                theme: {
                                                    ...formData.theme,
                                                    to: color,
                                                },
                                            });
                                        }}
                                    />
                                )}
                            </div>
                            <span className="mx-[8px]">hoặc</span>
                            <InputFile
                                accept="image/*"
                                onChange={(file) => {
                                    setFormData({
                                        ...formData,
                                        background: file,
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}
