'use client';

import { faArrowLeft, faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons';
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

export default function Page({ params, exercise = testData }: { params: { exerciseId: string }; exercise?: PostData }) {
    const [files, setAddFile, setRemoveFile] = useFile(exercise.files);
    const [isEdit, setIsEdit] = useState(exercise.files.length === 0);
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const router = useRouter();
    const pathName = usePathname();

    const handleBackToExercise = () => {
        router.replace(pathName.replaceAll(/exercise\/.*/g, 'exercise'));
    };

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
            <div
                onClick={handleBackToExercise}
                className="w-[40px] h-[40px] bg-white shadow-custom-1 flex items-center justify-center rounded-full mb-[16px] cursor-pointer"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <div className="flex items-start gap-[32px] relative">
                <PostCard postData={exercise} edit={false} />
                <div className="grow h-fit bg-white rounded-2xl px-[16px] py-[16px] sticky top-[16px] shadow-custom-1">
                    <div className="font-semibold text-[24px]">Bài tập của bạn</div>
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
                        <div>
                            <InputFile onChange={setAddFile} />
                        </div>
                    )}
                    <Button
                        handleClick={hanldeSubmit}
                        theme={!isEdit ? 'fill' : 'default'}
                        className={`w-full rounded-lg mt-[16px] ${isLoadingFile ? 'opacity-80' : ''}`}
                    >
                        {!isEdit ? 'Hủy nộp bài' : 'Nộp bài'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
