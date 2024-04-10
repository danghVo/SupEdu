'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

import { usePost, useClass } from '~/hooks';
import PostCard from '~/components/PostCard';
import NewPost from './componens/NewPost';
import { NotificationTheme } from '~/app/(ClientLayout)/(MainLayout)/layout';
import { NotificationType } from '~/components/Notification';

export default function Page({ params: { classUuid } }: { params: { classUuid: string } }) {
    const router = useRouter();
    const { data: posts, isSuccess: isPostsSuccess, refetch } = usePost(classUuid);
    const { data: classData, isSuccess: isClassSuccess } = useClass(classUuid);
    const notificationShow = useContext(NotificationTheme);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isPostsSuccess && isClassSuccess && !classData.isOwner) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                socket.on(`${classData.uuid}`, () => {
                    refetch();
                    queryClient.invalidateQueries({
                        queryKey: ['calendar', classData.uuid],
                    });
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [isPostsSuccess, isClassSuccess]);

    const handleOpenExercise = (type: string, index: number) => {
        if (type === 'Exercise') {
            router.replace(`/class/${classUuid}/exercise/${index}`);
        }
    };

    const onDelete = (isSuccess: boolean) => {
        if (isSuccess) {
            refetch();
            notificationShow('Xóa bài viết thành công', NotificationType.success);
            queryClient.invalidateQueries({
                queryKey: ['calendar', classData.uuid],
            });
        }
    };

    const onUpdate = (isSuccess: boolean) => {
        if (isSuccess) {
            refetch();
            notificationShow('Cập nhật bài viết thành công', NotificationType.success);
            queryClient.invalidateQueries({
                queryKey: ['calendar', classData.uuid],
            });
        }
    };

    return (
        <motion.div key={Math.random()} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {classData.isOwner && <NewPost classUuid={classUuid} />}

            {isPostsSuccess &&
                isClassSuccess &&
                (posts.length > 0 ? (
                    <div className={`flex flex-col items-center gap-[64px] relative z-50 mb-[32px]`}>
                        {posts.map((item: any, index: number) => (
                            <div
                                key={item.uuid}
                                id={item.uuid}
                                onClick={() => handleOpenExercise(item.type, item.uuid)}
                                className="w-full flex justify-center"
                            >
                                <PostCard
                                    classUuid={classData.uuid}
                                    postData={item}
                                    edit={false}
                                    editable={classData.isOwner}
                                    isPreview={item.type === 'Exercise'}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-[24px] text-center font-bold" style={{ color: classData.textColor }}>
                        Chưa có bài viết nào
                    </div>
                ))}
        </motion.div>
    );
}
