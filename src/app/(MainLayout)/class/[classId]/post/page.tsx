'use client';

import { motion } from 'framer-motion';
import PostCard from '~/components/PostCard';
import testData from './testData.json';
import NewPost from './componens/NewPost';

export default async function Page({ params }: { params: { classId: string } }) {
    return (
        <motion.div key={Math.random()} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <NewPost />

            <div className={`flex flex-col items-center gap-[64px] relative z-50`}>
                {testData.map((item, index) => (
                    <PostCard key={index} postData={item} edit={false} isPreview={item.type === 'Bài tập'} />
                ))}
            </div>
        </motion.div>
    );
}
