'use client';

import PostCard from '~/components/PostCard';
import testData from './testData.json';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Page() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={`flex flex-col items-center gap-[64px] relative z-50`}>
                {testData.map((item, index) => (
                    <Link href={`exercise/${index}`} className="w-full flex justify-center">
                        <PostCard key={index} postData={item} edit={false} isPreview />
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}
