import { use, useEffect, useState } from 'react';
import Comment from './Comment';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useComments, useProfile } from '~/hooks';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

export default function Comments({ postUuid }: { postUuid: string }) {
    const { data: comments, isSuccess: isCommentsSuccess, isRefetching, refetch } = useComments(postUuid);
    const [isViewComment, setIsViewComment] = useState(false);
    const { data: profile, isSuccess: isProfileSuccess } = useProfile();
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = io('http://localhost:4000');

        socket.on('connect', () => {
            socket.on(`${postUuid}/comments`, () => {
                refetch();
            });
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }

            queryClient.removeQueries({
                queryKey: ['comments', postUuid],
            });
        };
    }, []);

    useEffect(() => {
        if (isCommentsSuccess) {
            setIsViewComment(comments.length <= 2);
        }
    }, [isCommentsSuccess]);

    return (
        <>
            {comments &&
                (isViewComment ? (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'fit-content' }}>
                        {comments.map((comment: any) => (
                            <Comment postUuid={postUuid} commentData={comment} key={comment.uuid} />
                        ))}

                        <div
                            className="flex items-center text-slate-400 mt-[12px] gap-[12px] cursor-pointer"
                            onClick={() => {
                                setIsViewComment(false);
                            }}
                        >
                            <div className="w-full bg-slate-400 h-[4px] rounded-lg"></div>
                            <FontAwesomeIcon icon={faCaretUp} className="h-[24px]" />
                        </div>
                    </motion.div>
                ) : (
                    <div
                        className="font-semibold pl-[32px] mt-[24px] cursor-pointer"
                        onClick={() => {
                            setIsViewComment(true);
                        }}
                    >
                        <span className="mr-[12px]">Xem bình luận ({comments.length})</span>
                        <FontAwesomeIcon icon={faCaretDown} />
                    </div>
                ))}

            {isProfileSuccess && !isRefetching && <Comment postUuid={postUuid} currentUser={profile} key={0} />}
        </>
    );
}
