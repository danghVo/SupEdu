'use client';

import { motion } from 'framer-motion';
import PostCard from '~/components/PostCard';
import testData from './testData.json';
import NewPost from './componens/NewPost';
import { useRouter } from 'next/navigation';

export default async function Page({ params }: { params: { classId: string } }) {
    const router = useRouter();

    const handleOpenExercise = (type: string, index: number) => {
        if (type === 'Bài tập') {
            router.replace(`/class/${params.classId}/exercise/${index}`);
        }
    };

    return (
        <motion.div key={Math.random()} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <NewPost />

            <div className={`flex flex-col items-center gap-[64px] relative z-50`}>
                {testData.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleOpenExercise(item.type, index)}
                        className="w-full flex justify-center"
                    >
                        <PostCard postData={item} edit={false} isPreview={item.type === 'Bài tập'} />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
