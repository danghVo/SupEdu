import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import Form from '~/components/Form';
import Input from '~/components/Input';
import { requiredRule } from '~/components/Input/rules';
import Modal from '~/components/Modal';
import InputCheckbox from '~/components/Input/InputCheckbox';
import Selection from '~/components/Selection';
import Loading from '~/components/Loading';

export interface FormData {
    name: string;
    description: string;
    password: string;
    requireApprove: boolean;
    theme: {
        to: string;
        from: string;
    };
    showPassword?: string;
    textColor: string;
    background?: string;
}

export default function CreateClassModal({
    initFormData = undefined,
    handleCloseModal,
    handleSubmit,
}: {
    initFormData?: FormData;
    handleCloseModal: () => void;
    handleSubmit: (formData: FormData) => void;
}) {
    const [openColorPicker, setOpenColorPicker] = useState({
        from: false,
        to: false,
    });
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: initFormData?.name || '',
        description: initFormData?.description || '',
        password: initFormData?.showPassword || '',
        requireApprove: initFormData?.requireApprove || false,
        theme: initFormData?.theme || {
            from: '#000000',
            to: '#000000',
        },
        textColor: initFormData?.textColor || 'white',
    });

    const handleSubmitForm = async () => {
        setLoading(true);
        await handleSubmit(formData);
        setLoading(false);
    };

    return (
        <Modal handleCloseModal={handleCloseModal} height={'h-fit'} width={'w-fit'}>
            <Form
                handleSubmit={() => handleSubmitForm()}
                submit={{
                    content: loading ? <Loading className="text-[32px]" /> : 'Lưu',
                    custom: 'mt-[16px] mx-0',
                    loading,
                }}
            >
                <div className="px-[16px] pt-[8px] flex flex-col gap-[16px]">
                    <div className="text-center text-[24px] font-bold mb-[8px]">Thông tin</div>
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
                    <div className="flex px-[12px] mt-[16px] items-center" style={{ color: formData.textColor }}>
                        <div className="w-[100px] font-semibold text-black">Màu chữ</div>
                        <Selection
                            className={`${formData.textColor === 'white' ? 'bg-black' : 'shadow-custom-1'} rounded-lg w-fit`}
                            label=""
                            optionData={['trắng', 'đen']}
                            onChange={(selection: string) => {
                                setFormData({
                                    ...formData,
                                    textColor: selection === 'đen' ? 'black' : 'white',
                                });
                            }}
                            defaultSelection={formData.textColor === 'white' ? 'trắng' : 'đen'}
                        />
                    </div>

                    <div className="flex px-[12px] mt-[16px] items-center">
                        <div className="w-[100px] font-semibold">Nền</div>
                        <div className="flex justify-start items-center relative">
                            <div
                                className={`w-[40px] h-[40px] cursor-pointer rounded-l-lg relative shadow-custom-1`}
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
                                className={`w-[40px] h-[40px] cursor-pointer rounded-r-lg relative shadow-custom-1`}
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
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}
