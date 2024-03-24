import { faCirclePlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import PostCard from '~/components/PostCard';
import { PostController } from '~/controller';

export default function NewPost({ classUuid }: { classUuid: string }) {
    const [isNewPost, setIsNewPost] = useState(false);
    const queryClient = useQueryClient();

    const handleCreatePost = async (payload: any) => {
        const postController = new PostController();

        const res = await queryClient.fetchQuery({
            queryKey: ['createPost'],
            queryFn: () => postController.createPost(payload, classUuid),
        });

        if (res && !res.error) {
            await queryClient.invalidateQueries({
                queryKey: ['posts', classUuid],
            });
            setIsNewPost(false);
        }
    };

    return (
        <>
            <motion.div
                onClick={() => {
                    if (isNewPost) {
                        setIsNewPost(false);
                    } else {
                        setIsNewPost(true);
                    }
                }}
                initial={{ left: 0 }}
                animate={!isNewPost ? { left: 0 } : { left: '90%' }}
                className={`bg-white w-fit h-[60px] p-[8px] rounded-full flex items-center justify-center shadow-custom-4 cursor-pointer relative ${isNewPost ? '' : 'mb-[32px]'} `}
            >
                <FontAwesomeIcon icon={!isNewPost ? faCirclePlus : faCircleXmark} className="text-[32px]" />
                {!isNewPost && <span className="text-[16px] px-[12px] font-semibold">Bài đăng mới</span>}
            </motion.div>
            <div className="">
                <AnimatePresence>
                    {isNewPost && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: 'auto',
                                opacity: 1,
                                marginBottom: '64px',
                                transition: {
                                    type: 'spring',
                                    bounce: 0.3,
                                    opacity: { delay: 0.1 },
                                },
                            }}
                            exit={{ height: 0, marginBottom: 0, opacity: 0 }}
                            className="w-full flex justify-center z-0"
                        >
                            <PostCard edit handleSubmit={handleCreatePost} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
