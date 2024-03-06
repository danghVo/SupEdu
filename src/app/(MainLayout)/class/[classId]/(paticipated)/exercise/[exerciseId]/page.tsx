'use client';

import { faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useState } from 'react';
import Button from '~/components/Button';
import InputFile from '~/components/Input/InputFile';
import PostCard, { PostData } from '~/components/PostCard';
import { FileType } from '~/constant';
import useFile from '~/hooks/useFile';
import testData from './testData.json';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { RawDraftContentState } from 'draft-js';
import colorLevel from '~/components/TextEditor/utils/colorLevel';
import TextEditor from '~/components/TextEditor';
import checkTimeExprire from '~/components/TextEditor/utils/checkTimeExpire';

interface ExerciseDetailData extends PostData {
    score: string | number | null;
    comment: RawDraftContentState | null;
}

export default function Page({
    params,
    exercise = testData,
}: {
    params: { exerciseId: string };
    exercise?: ExerciseDetailData;
}) {
    const [files, setAddFile, setRemoveFile] = useFile(exercise.files);
    const [isEdit, setIsEdit] = useState(exercise.files.length === 0);
    const [isLoadingFile, setIsLoadingFile] = useState(false);

    const hanldeSubmit = () => {
        if (!isLoadingFile) {
            if (isEdit) {
                setIsLoadingFile(true);

                setTimeout(() => {
                    setIsLoadingFile(false);
                }, 5000);
            } else {
            }

            setIsEdit((prev) => !prev);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-start gap-[32px] relative">
                <PostCard postData={exercise} edit={false} />
                <div className="grow sticky top-[16px] ">
                    <div className="bg-white h-fit rounded-2xl px-[16px] py-[16px] shadow-custom-1">
                        <div className="font-semibold flex items-center justify-between">
                            <div className="text-[20px]">Bài tập của bạn</div>
                            {exercise.score && (
                                <div className="text-[16px]">
                                    Điểm: <span className={`${colorLevel(exercise.score)}`}>{exercise.score}</span>/100
                                </div>
                            )}
                        </div>
                        {files.length > 0 ? (
                            <div className="mt-[8px] px-[12px] relative flex flex-col items-center">
                                <AnimatePresence>
                                    {isLoadingFile && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-full h-full absolute top-0 left-0 right-0 flex items-center justify-center bg-slate-100 rounded-lg text-[32px]"
                                        >
                                            <motion.div
                                                initial={{ rotate: 0 }}
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <FontAwesomeIcon icon={faCircleNotch} />
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        style={{ borderColor: file.color }}
                                        className={`border-2 w-full h-[50px] px-[12px] flex items-center rounded-lg my-[12px]`}
                                    >
                                        <Image
                                            src={require(`~/assets/filetype/${file.type}.png`)}
                                            className="bg-contain w-fit max-h-full py-[8px] pr-[8px]"
                                            alt="file-type"
                                        />
                                        <a
                                            href={file.path}
                                            download
                                            title={file.name}
                                            className="flex items-center truncate h-full border-l-2 border-inherit px-[8px] grow"
                                        >
                                            <span className="truncate text-[13px]">{file.name}</span>
                                        </a>
                                        {isEdit && (
                                            <div
                                                className="h-full flex items-center cursor-pointer pl-[8px]"
                                                onClick={() => setRemoveFile(index)}
                                            >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            isEdit && (
                                <InputFile onChange={setAddFile}>
                                    <Button className="w-full rounded-lg mt-[16px]" handleClick={() => {}}>
                                        Thêm tập tin
                                    </Button>
                                </InputFile>
                            )
                        )}

                        <Button
                            handleClick={hanldeSubmit}
                            theme={!isEdit ? 'fill' : 'default'}
                            className={`w-full rounded-lg mt-[8px] ${isLoadingFile ? 'opacity-80' : ''} ${checkTimeExprire(exercise.timeTaskEnd!.time, exercise.timeTaskEnd!.date) ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            {!isEdit ? 'Hủy nộp bài' : 'Nộp bài'}
                        </Button>
                    </div>

                    <div className="bg-white shadow-custom-1 mt-[32px] min-h-[100px] rounded-2xl pt-[12px] pb-[16px] px-[4px]">
                        {exercise.comment && (
                            <TextEditor
                                label="Nhận xét từ giáo viên"
                                className="border-none"
                                editable={!!exercise.comment}
                                rawContentState={exercise.comment}
                            />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
