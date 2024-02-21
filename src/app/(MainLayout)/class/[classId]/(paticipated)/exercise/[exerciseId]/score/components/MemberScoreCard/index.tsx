import { FileType, TimeData } from '~/constant';
import MemberCard, { MemberCardInfor } from '../../../../../components/MemberCard';
import { useState } from 'react';
import Button from '~/components/Button';
import DetailAsignment from '../DetailAsignment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import Input from '~/components/Input';
import { AnimatePresence } from 'framer-motion';
import Modal from '~/components/Modal';
import TextEditor from '~/components/TextEditor';
import MarkScoreModal from './components/MarkScoreModal';
import colorLevel from '~/components/TextEditor/utils/colorLevel';

interface MemberScoreInfor extends MemberCardInfor {
    score: string | number | null;
    timeAsign: TimeData;
    files: Array<FileType>;
}

export default function MemberScoreCard({ infor }: { infor: MemberScoreInfor }) {
    const [openDetailAsign, setOpenDetailAsign] = useState(false);
    const [openMarkScore, setOpenMarkScore] = useState(false);

    return (
        <div className="w-full flex flex-col items-center">
            <MemberCard
                className={`${openDetailAsign ? 'rounded-b-none' : ''}`}
                infor={{ name: infor.name }}
                actionsElement={
                    <>
                        <div>
                            <span className="font-semibold text-[18px]">Thời gian nộp: </span>
                            <span className="">
                                {infor.timeAsign.time} {infor.timeAsign.date}
                            </span>
                        </div>
                        <div className="flex items-center">
                            {infor.score !== null ? (
                                <div>
                                    <span className="font-semibold text-[18px] mr-[4px]">Điểm:</span>
                                    <span className={`font-medium ${colorLevel(infor.score)}`}>{infor.score}</span>
                                    /100
                                </div>
                            ) : (
                                <Button
                                    handleClick={() => {
                                        setOpenMarkScore(true);
                                    }}
                                    className="rounded-lg"
                                    theme="fill"
                                >
                                    Chấm điểm
                                </Button>
                            )}
                        </div>
                        <div
                            className="p-[4px] cursor-pointer"
                            onClick={() => {
                                setOpenDetailAsign((prev) => !prev);
                            }}
                        >
                            <FontAwesomeIcon icon={openDetailAsign ? faCaretDown : faCaretUp} />
                        </div>
                    </>
                }
            />
            <AnimatePresence>{openDetailAsign && <DetailAsignment files={infor.files} />}</AnimatePresence>
            {openMarkScore && (
                <MarkScoreModal
                    handleCloseModal={() => {
                        setOpenMarkScore(false);
                    }}
                />
            )}
        </div>
    );
}
