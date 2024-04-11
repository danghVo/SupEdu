import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import Input from '~/components/Input';
import image from '~/assets/image';
import TextEditor from '~/components/TextEditor';
import { RawDraftContentState } from 'draft-js';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useQueryClient } from '@tanstack/react-query';
import { PostController } from '~/controller';

export interface CommentData {
    user: {
        name: string;
        avatar: string;
        role: string;
    };
    content: string;
    createIn: {
        date: string;
        time: string;
    };
}

export default function Comment({
    postUuid,
    currentUser,
    commentData,
}: {
    postUuid: string;
    currentUser?: { avatar: string; role: string };
    commentData?: CommentData & { user: { name: string; avatar: string; role: string } };
}) {
    const [comment, setComment] = useState<RawDraftContentState | null>(
        commentData ? JSON.parse(commentData.content) : null,
    );
    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        if (postUuid) {
            const currentDay = new Date();

            const postController = new PostController();

            const res = await queryClient.fetchQuery({
                queryKey: ['comment', postUuid],
                queryFn: () =>
                    postController.comment(postUuid, {
                        content: JSON.stringify(comment),
                        createIn: {
                            date: `${currentDay.getDate() < 9 ? '0' : ''}${currentDay.getDate()}/${currentDay.getMonth() + 1 < 10 ? '0' : ''}${currentDay.getMonth() + 1}/${currentDay.getFullYear()}`,
                            time: `${currentDay.getHours() < 10 ? '0' : ''}${currentDay.getHours()}:${currentDay.getMinutes() <= 9 ? '0' + currentDay.getMinutes() : currentDay.getMinutes()}`,
                        },
                    }),
            });

            if (!res.error) {
                queryClient.invalidateQueries({
                    queryKey: ['comments', postUuid],
                });
            }
        }
    };

    const avatar = useMemo(() => {
        if (commentData?.user) {
            if (commentData.user.avatar) {
                return commentData.user.avatar;
            } else {
                return commentData.user.role === 'TEACHER' ? image.teacher : image.student;
            }
        }

        if (currentUser) {
            if (currentUser.avatar) {
                return currentUser.avatar;
            } else {
                return currentUser.role === 'TEACHER' ? image.teacher : image.student;
            }
        }
        return '';
    }, [commentData?.user, currentUser]);

    return (
        <div className="mt-[24px] flex items-start">
            {avatar && (
                <Image
                    src={avatar}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="mr-[24px] bg-white rounded-full shadow-custom-5"
                />
            )}

            <div style={{ width: 'calc(100% - 64px)' }}>
                <div className="flex flex-col shadow-custom-5 bg-white px-[8px] py-[12px] rounded-[18px] text-[var(--text-color)]">
                    <div className="mb-[8px] ml-[4px] font-bold">{commentData?.user.name}</div>
                    <div className="w-full">
                        <TextEditor
                            editable={!commentData}
                            isToolboxOffetStype={false}
                            isToolboxType={false}
                            onChange={setComment}
                            label="Bình luận"
                            rawContentState={comment}
                        />
                    </div>

                    {!commentData && (
                        <Button
                            handleClick={handleSubmit}
                            icon={<FontAwesomeIcon icon={faPaperPlane} />}
                            className="bg-blue-500 w-[100px] text-white mt-[12px] self-end mr-[12px]"
                            theme=""
                        >
                            Gửi
                        </Button>
                    )}
                </div>
                {commentData && commentData.createIn && (
                    <div className="pl-[12px] mt-[-4px] mb-[4px] mt-[12px]">
                        {commentData.createIn.time} {commentData.createIn.date}
                    </div>
                )}
            </div>
        </div>
    );
}