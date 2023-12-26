'use client';

import Image from 'next/image';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

import Form from '~/components/Form';
import image from '~/assets/image';
import InputRatio from '~/components/Input/InputRatio';
import { SignUpFormProps } from '../@form1/page';
import { FormController } from '../layout';

export default function Page() {
    const { onBackward, onForward }: SignUpFormProps = useContext(FormController);

    return (
        <>
            <div className="w-full cursor-pointer" onClick={onBackward}>
                <FontAwesomeIcon icon={faCaretLeft} className="text-[32px] ml-[32px]" />
            </div>
            <Form
                handleSubmit={() => {}}
                className="w-full"
                submit={{ content: 'Hoàn thành', custom: 'rounded-full ' }}
            >
                <InputRatio
                    selectionData={[
                        {
                            value: 'teacher',
                            ui: (
                                <div className="mx-2 flex items-center gap-4 text-[18px]">
                                    <Image src={image.teacher} alt={'Giáo viên'} className="w-[30px]" /> Giáo viên
                                </div>
                            ),
                        },
                        {
                            value: 'student',
                            ui: (
                                <div className="mx-2 flex items-center gap-4 text-[18px]">
                                    <Image src={image.student} alt={'Học sinh'} className="w-[30px]" /> Học sinh
                                </div>
                            ),
                        },
                    ]}
                    value=""
                    onChange={() => {}}
                    label={'Bạn là'}
                />
            </Form>
        </>
    );
}
