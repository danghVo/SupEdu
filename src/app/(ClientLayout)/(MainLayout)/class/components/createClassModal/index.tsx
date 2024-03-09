import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import Form from '~/components/Form';

import Input from '~/components/Input';
import InputFile from '~/components/Input/InputFile';
import { requiredRule } from '~/components/Input/rules';
import Modal from '~/components/Modal';
import { FormData } from '../../page';
import { QueryClient, useQueryClient, QueryCache } from '@tanstack/react-query';
import { ClassController } from '~/controller/class.controller';

export default function CreateClassModal({
    formData,
    onChange,
    handleCloseModal,
}: {
    formData: FormData;
    onChange: (formData: FormData) => void;
    handleCloseModal: () => void;
}) {
    const [openColorPicker, setOpenColorPicker] = useState({
        from: false,
        to: false,
    });
    const queryClient = useQueryClient(new QueryClient());

    const handleSubmit = () => {
        // const queryData = queryClient.getQueryData('userUuid');
        // if () {
        //     const userUuid = queryqlient.userUuid;
        //     const classController = new ClassController();
        //     const data = queryClient.fetchQuery({
        //         queryKey: [formData, userUuid],
        //         queryFn: () => classController.createClass(formData, userUuid),
        //     });
        // }
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
                            onChange({
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
                            onChange({
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
                            onChange({
                                ...formData,
                                password: value,
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
                                style={{ backgroundColor: formData.background.from }}
                            >
                                {openColorPicker.from && (
                                    <HexColorPicker
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className="absolute top-[110%] left-0 w-full h-full z-10"
                                        color={formData.background.from}
                                        onChange={(color) => {
                                            onChange({
                                                ...formData,
                                                background: {
                                                    ...formData.background,
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
                                style={{ backgroundColor: formData.background.to }}
                            >
                                {openColorPicker.to && (
                                    <HexColorPicker
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className="absolute top-[110%] left-0 w-full h-full z-10"
                                        color={formData.background.to}
                                        onChange={(color) => {
                                            onChange({
                                                ...formData,
                                                background: {
                                                    ...formData.background,
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
                                    onChange({
                                        ...formData,
                                        background: {
                                            ...formData.background,
                                            image: file,
                                        },
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
