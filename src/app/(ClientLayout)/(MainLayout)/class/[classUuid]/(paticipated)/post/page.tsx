'use client';

import { motion } from 'framer-motion';
import PostCard from '~/components/PostCard';
import testData from './testData.json';
import NewPost from './componens/NewPost';
import { useRouter } from 'next/navigation';
import useClass from '~/hooks/useClass';
import useProfile from '~/hooks/useProfile';
import usePost from '~/hooks/usePost';
import { useEffect } from 'react';

export default function Page({ params: { classUuid } }: { params: { classUuid: string } }) {
    const router = useRouter();
    const { data: posts, isSuccess: isPostsSuccess, refetch } = usePost(classUuid);
    const { data: user, isSuccess: isUserSuccess } = useProfile();

    const handleOpenExercise = (type: string, index: number) => {
        if (type === 'Exercise') {
            router.replace(`/class/${classUuid}/exercise/${index}`);
        }
    };

    return (
        <motion.div key={Math.random()} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {user?.role === 'TEACHER' && <NewPost classUuid={classUuid} />}

            {isPostsSuccess &&
                (posts.length > 0 ? (
                    <div className={`flex flex-col items-center gap-[64px] relative z-50`}>
                        {posts.map((item: any, index: number) => (
                            <div
                                key={index}
                                onClick={() => handleOpenExercise(item.type, index)}
                                className="w-full flex justify-center"
                            >
                                <PostCard postData={item} edit={false} isPreview={item.type === 'Exercise'} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-[24px] text-center font-bold">Chưa có bài viết nào</div>
                ))}
        </motion.div>
    );
}
