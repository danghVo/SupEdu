'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { io } from 'socket.io-client';

import { useClass, useExercises } from '~/hooks';
import PostCard from '~/components/PostCard';

export default function Page({ params: { classUuid } }: { params: { classUuid: string } }) {
    const { data: exercises, isSuccess: isExercisesSuccess, refetch } = useExercises(classUuid);
    const {
        data: { textColor, isOwner },
        isSuccess: isClassSuccess,
    } = useClass(classUuid);

    useEffect(() => {
        if (isExercisesSuccess && isClassSuccess && !isOwner) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                socket.on(`${classUuid}`, () => {
                    refetch();
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [isExercisesSuccess, isClassSuccess]);

    return (
        isExercisesSuccess &&
        isClassSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={`flex flex-col items-center gap-[64px] relative z-50`}>
                    {exercises.length === 0 && (
                        <div style={{ color: textColor }} className="text-[24px] font-bold">
                            Không có bài tập nào
                        </div>
                    )}
                    {exercises.map((item: any, index: number) => (
                        <Link key={index} href={`exercise/${item.uuid}`} className="w-full flex justify-center">
                            <PostCard key={index} postData={item} edit={false} isPreview />
                        </Link>
                    ))}
                </div>
            </motion.div>
        )
    );
}
