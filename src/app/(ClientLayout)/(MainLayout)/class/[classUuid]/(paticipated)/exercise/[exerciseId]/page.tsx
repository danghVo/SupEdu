'use client';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RawDraftContentState } from 'draft-js';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';

import { useExercise, useFile, useClass, usePost } from '~/hooks';
import Button from '~/components/Button';
import InputFile from '~/components/Input/InputFile';
import PostCard, { PostData } from '~/components/PostCard';
import TextEditor from '~/components/TextEditor';
import colorLevel from '~/components/TextEditor/utils/colorLevel';
import checkTimeExprire from '~/components/TextEditor/utils/checkTimeExpire';
import { PostController } from '~/controller';
import { NotificationTheme } from '~/app/(ClientLayout)/(MainLayout)/layout';
import { NotificationType } from '~/components/Notification';

export default function Page({
    params: { exerciseId, classUuid },
}: {
    params: { exerciseId: string; classUuid: string };
}) {
    const { data: exercise, isSuccess: isExerciseSuccess, refetch } = useExercise(exerciseId);
    const { data: classData, isSuccess: isClassSuccess } = useClass(classUuid);
    const {refetch: refetchPost} = usePost(classUuid);
    const { files, fileBuffers, setAddFile, setRemoveFile, setInitFiles, setClearFiles } = useFile();
    const [isEdit, setIsEdit] = useState(true);
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();
    const notificationShow = useContext(NotificationTheme);

    useEffect(() => {
        if (isExerciseSuccess && isClassSuccess && !classData.isOwner) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                socket.on(`${classUuid}/${exercise.uuid}`, () => {
                    queryClient.invalidateQueries({
                        queryKey: ['exercise', exercise.uuid],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['calendar', classUuid],
                    });
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [isExerciseSuccess, isClassSuccess]);

    useEffect(() => {
        if (isExerciseSuccess && isClassSuccess && !classData.isOwner) {
            setInitFiles(exercise.assignment.assignFiles);
            setIsEdit(!exercise.assignment.timeAssign.date);
        }
    }, [isExerciseSuccess, isClassSuccess]);

    const hanldeSubmit = async () => {
        if (exercise.assignment.timeAssign.date && !isEdit) {
            setIsEdit(true);
            return;
        }

        setIsLoadingFile(true);
        setIsEdit(false);
        const postController = new PostController();

        const now = new Date(Date.now()).toISOString();
        const date = now.split('T')[0].split('-').reverse().join('/');
        const time = now.split('T')[1].split(':').slice(0, 2).join(':');

        const payload = {
            uuid: exercise.assignment.uuid,
            timeAssign: {
                date,
                time,
            },
            files: fileBuffers,
        };

        const data = await postController.submitExercise(exerciseId, payload);

        if (!data.error) {
            refetch();
            notificationShow('Nộp bài thành công', NotificationType.success);
            setIsLoadingFile(false);
            return true;
        } else {
            notificationShow(data.error, NotificationType.error);

            return false;
        }
    };

    const onDelete = (isSuccess: boolean) => {
        if (isSuccess) {
            router.push(`/class/${classUuid}/exercise`);
            refetch();
            refetchPost();
            notificationShow('Xóa bài tập thành công', NotificationType.success);
            queryClient.invalidateQueries({
                queryKey: ['calendar', classUuid],
            });
        } else notificationShow('Xóa bài tập thất bại', NotificationType.error);
    };

    const onUpdate = (isSuccess: boolean) => {
        if (isSuccess) {
            refetch();
            notificationShow('Cập nhật bài tập thành công', NotificationType.success);
            queryClient.invalidateQueries({
                queryKey: ['calendar', classUuid],
            });
        } else {
            notificationShow('Cập nhật bài tập thất bại', NotificationType.error);
        }
    };

    return (
        isExerciseSuccess &&
        isClassSuccess && (
            <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className={`flex ${classData.isOwner ? 'justify-center' : 'items-start'} gap-[32px] relative`}>
                        <PostCard
                            key={Math.random()}
                            classUuid={classUuid}
                            postData={exercise}
                            edit={false}
                            editable={classData.isOwner}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                        />
                        {!classData.isOwner && (
                            <div className="grow sticky top-[16px] ">
                                <div className="bg-white h-fit rounded-2xl px-[16px] py-[16px] shadow-custom-1">
                                    <div className="font-semibold flex items-center justify-between">
                                        <div className="text-[20px]">Nộp bài</div>
                                        {exercise.assignment.isMarked && (
                                            <div className="text-[16px]">
                                                Điểm:{' '}
                                                <span className={`${colorLevel(exercise.assignment.score)}`}>
                                                    {exercise.assignment.score}
                                                </span>
                                                /100
                                            </div>
                                        )}
                                    </div>
                                    {files.length > 0 && (
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
                                                            transition={{
                                                                duration: 1,
                                                                repeat: Infinity,
                                                                ease: 'linear',
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faCircleNotch} />
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            {files.map((file: any, index: number) => (
                                                <div
                                                    key={file.uuid}
                                                    style={{ borderColor: file.color }}
                                                    className={`border-2 w-full h-[50px] px-[12px] flex items-center rounded-lg my-[12px]`}
                                                >
                                                    <Image
                                                        src={`/extension/${file.extension}.png`}
                                                        className="bg-contain w-fit max-h-full py-[8px] pr-[8px]"
                                                        alt="file-type"
                                                        width={20}
                                                        height={50}
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
                                                            onClick={() => setRemoveFile(index, !file?.uuid)}
                                                        >
                                                            <FontAwesomeIcon icon={faXmark} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {checkTimeExprire(exercise.timeTaskEnd!.time, exercise.timeTaskEnd!.date) ? <div className='text-center text-red-500 font-bold py-[12px]'>Hết hạn nộp bài</div> :isEdit && (
                                        <InputFile onChange={setAddFile}>
                                            <Button className="w-full rounded-lg mt-[16px]" handleClick={() => {}}>
                                                Thêm tập tin
                                            </Button>
                                        </InputFile>
                                    )}
                                    {!exercise.assignment.isMarked && (
                                        <Button
                                            handleClick={hanldeSubmit}
                                            theme="fill"
                                            disabled={fileBuffers.length === 0 && isEdit}
                                            className={`w-full rounded-lg mt-[8px] ${isLoadingFile ? 'opacity-80' : ''} ${checkTimeExprire(exercise.timeTaskEnd!.time, exercise.timeTaskEnd!.date) || files.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                                        >
                                            {exercise.assignment.timeAssign.date
                                                ? isEdit
                                                    ? 'Lưu'
                                                    : 'Chỉnh sửa'
                                                : 'Nộp bài'}
                                        </Button>
                                    )}

                                    {isEdit && 
                                        <Button
                                        handleClick={() => { setIsEdit(false); setClearFiles(); }}
                                        className={`w-full rounded-lg mt-[8px] ${isLoadingFile ? 'opacity-80' : ''}`}
                                            >
                                                Hủy
                                            </Button>
                                    }
                                </div>

                                {exercise.assignment.feedback && (
                                    <div className="bg-white shadow-custom-1 mt-[32px] min-h-[100px] rounded-2xl pt-[12px] pb-[16px] px-[4px]">
                                        {exercise.assignment.feedback && (
                                            <TextEditor
                                                label="Nhận xét từ giáo viên"
                                                className="border-none"
                                                editable={exercise.assignment.feedback}
                                                rawContentState={
                                                    JSON.parse(exercise.assignment.feedback) as RawDraftContentState
                                                }
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </>
        )
    );
}
