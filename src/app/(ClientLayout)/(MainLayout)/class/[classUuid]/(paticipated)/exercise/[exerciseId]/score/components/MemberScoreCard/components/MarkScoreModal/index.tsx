import { RawDraftContentState } from 'draft-js';
import { useState } from 'react';

import Button from '~/components/Button';
import Input from '~/components/Input';
import Modal from '~/components/Modal';
import TextEditor from '~/components/TextEditor';

export default function MarkScoreModal({
    initScore = '0',
    initFeedback = null,
    handleSubmit,
    handleCloseModal,
}: {
    initScore?: string;
    initFeedback?: string | null;
    handleSubmit: (score: string, feedback: string) => void;
    handleCloseModal: () => void;
}) {
    const [score, setScore] = useState(initScore);
    const [feedback, setFeedback] = useState<RawDraftContentState | null>(
        initFeedback ? JSON.parse(initFeedback) : initFeedback,
    );

    const handleInputScore = (value: string) => {
        if ((value.match(/^[0-9]*$/g) && value.length < 3) || value === '100') {
            setScore(value);
        }
    };

    const handleBlurScore = () => {
        if (!score) {
            setScore('0');
        }
    };

    return (
        <Modal handleCloseModal={handleCloseModal} width={'w-[400px]'} height={'h-fit'}>
            <div className="px-[12px] py-[24px]">
                <div className="text-center text-[24px] font-bold mb-[12px]">Chấm điểm</div>
                <div className="flex mb-[12px] px-[12px]">
                    <div className="text-[18px] mr-[16px] font-semibold">Điểm:</div>
                    <Input
                        onBlur={handleBlurScore}
                        value={score}
                        onChange={handleInputScore}
                        classNameWrapper="rounded-xl w-[50px] h-[24px]"
                        className="text-center pl-0 pr-0"
                        reset={false}
                    />
                    <span className="ml-[2px]">/100</span>
                </div>
                <div className="flex">
                    <TextEditor editable rawContentState={feedback} onChange={setFeedback} label="Nhận xét" />
                </div>

                <div className="flex justify-center">
                    <Button
                        theme="fill"
                        handleClick={() => handleSubmit(score, JSON.stringify(feedback))}
                        className="rounded-lg mt-[12px] w-full mx-[12px]"
                    >
                        Xác nhận
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
