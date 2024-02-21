import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RawDraftContentState } from 'draft-js';
import { useState } from 'react';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Modal from '~/components/Modal';
import TextEditor from '~/components/TextEditor';

export default function MarkScoreModal({ handleCloseModal }: { handleCloseModal: () => void }) {
    const [score, setScore] = useState('0');
    const [comment, setComment] = useState<RawDraftContentState | null>(null);

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
        <Modal handleCloseModal={handleCloseModal} width={'500px'} height={'fit-conent'}>
            <div className="px-[12px] py-[24px] relative">
                <div className="absolute right-[16px] top-[16px] text-[24px] cursor-pointer" onClick={handleCloseModal}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className="text-center text-[24px] font-bold mb-[12px]">Chấm điểm</div>
                <div className="flex mb-[12px] px-[12px]">
                    <div className="text-[18px] mr-[16px] font-semibold">Điểm:</div>
                    <Input
                        onBlur={handleBlurScore}
                        value={score}
                        onChange={handleInputScore}
                        classNameWrapper="rounded-xl w-[50px] h-[30px]"
                        className="text-center pr-[12px]"
                        reset={false}
                    />
                    <span className="ml-[2px]">/100</span>
                </div>
                <div className="flex">
                    <TextEditor editable rawContentState={comment} onChange={setComment} label="Nhận xét" />
                </div>

                <div className="flex justify-center">
                    <Button theme="fill" handleClick={() => {}} className="rounded-lg mt-[12px] w-full mx-[12px]">
                        Xác nhận
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
