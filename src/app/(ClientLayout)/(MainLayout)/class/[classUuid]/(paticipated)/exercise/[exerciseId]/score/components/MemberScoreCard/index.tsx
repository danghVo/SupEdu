import { FileType, TimeData } from '~/constant';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import MemberCard, { MemberCardInfor } from '../../../../../components/MemberCard';
import Button from '~/components/Button';
import DetailAsignment from '../DetailAsignment';
import MarkScoreModal from './components/MarkScoreModal';
import colorLevel from '~/components/TextEditor/utils/colorLevel';
import { PostController } from '~/controller';

interface MemberScoreInfor extends MemberCardInfor {
    isMarked: boolean;
    score: string | number;
    feedback: string | null;
    timeAssign: TimeData;
    assignFiles: Array<FileType>;
    user: {
        name: string;
        email: string;
        avatar: string | null;
        role: string;
    };
}

export default function MemberScoreCard({
    classUuid,
    infor,
    submitUuid,
    refetch,
}: {
    classUuid: string;
    refetch: any;
    submitUuid: string;
    infor: MemberScoreInfor;
}) {
    const [openDetailAsign, setOpenDetailAsign] = useState(false);
    const [openMarkScore, setOpenMarkScore] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleMarkScore = async (score: string, feedback: string) => {
        setLoading(true);
        const postController = new PostController();

        const data = await postController.markScore(classUuid, submitUuid, score, feedback);

        if (!data.error) {
            refetch();
            setOpenMarkScore(false);
        }

        setLoading(false);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <MemberCard
                className={`${openDetailAsign ? 'rounded-b-none' : ''}`}
                infor={{
                    email: infor.user.email,
                    name: infor.user.name,
                    avatar: infor.user.avatar,
                    role: infor.user.role,
                }}
                actionsElement={
                    <>
                        {infor.timeAssign.time ? (
                            <div>
                                <span className="font-semibold text-[18px]">Thời gian nộp: </span>
                                <span className="">
                                    {infor.timeAssign.time} {infor.timeAssign.date}
                                </span>
                            </div>
                        ) : (
                            <div className="font-semibold text-[18px]">Chưa nộp</div>
                        )}
                        <div className="flex items-center">
                            <div>
                                <span className="font-semibold text-[18px] mr-[4px]">Điểm:</span>
                                <span className={`font-medium ${colorLevel(infor.score)}`}>{infor.score}</span>
                                /100
                            </div>
                            {typeof infor.isMarked === 'boolean' && (
                                <Button
                                    handleClick={() => {
                                        setOpenMarkScore(true);
                                    }}
                                    className="rounded-lg  ml-[12px]"
                                    theme="fill"
                                >
                                    {loading ? (
                                        <motion.div animate={{ rotate: '360' }} transition={{ repeat: Infinity }}>
                                            <FontAwesomeIcon icon={faCircleNotch} />
                                        </motion.div>
                                    ) : infor.isMarked ? (
                                        'Sửa đổi'
                                    ) : (
                                        'Chấm điểm'
                                    )}
                                </Button>
                            )}
                        </div>
                        {infor.timeAssign.time && (
                            <div
                                className="p-[4px] cursor-pointer"
                                onClick={() => {
                                    setOpenDetailAsign((prev) => !prev);
                                }}
                            >
                                <FontAwesomeIcon icon={openDetailAsign ? faCaretDown : faCaretUp} />
                            </div>
                        )}
                    </>
                }
            />
            <AnimatePresence>{openDetailAsign && <DetailAsignment files={infor.assignFiles} />}</AnimatePresence>
            {openMarkScore && (
                <MarkScoreModal
                    initScore={infor.score.toString()}
                    initFeedback={infor.feedback || null}
                    handleSubmit={handleMarkScore}
                    handleCloseModal={() => {
                        setOpenMarkScore(false);
                    }}
                />
            )}
        </div>
    );
}
