import Image from 'next/image';
import { useEffect, useState } from 'react';
import Input from '~/components/Input';
import image from '~/assets/image';
import TextEditor from '~/components/TextEditor';
import { RawDraftContentState } from 'draft-js';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export interface CommentData {
    // author: string;
    rawComment: RawDraftContentState;
    time: string;
}

export default function Comment({
    postId,
    currentUser,
    commentData,
}: {
    postId?: string;
    currentUser?: string;
    commentData?: CommentData;
}) {
    const [comment, setComment] = useState<RawDraftContentState | null>(commentData ? commentData.rawComment : null);

    const handleSubmit = () => {
        const currnetTime = new Date();
        console.log({
            comment,
            time: `${currnetTime.getHours()}:${currnetTime.getMinutes()}, ${currnetTime.getDate()}/${currnetTime.getMonth() + 1}/${currnetTime.getFullYear()}`,
        });
    };

    return (
        <div className="mt-[24px] flex items-start">
            <Image
                src={image.student}
                alt="avatar"
                className="w-[40px] h-[40px] mr-[24px] bg-white rounded-full shadow-custom-5"
            />

            <div
                className="flex flex-col shadow-custom-5 bg-white px-[8px] py-[12px] rounded-[18px]"
                style={{ width: 'calc(100% - 64px)' }}
            >
                {commentData && commentData.time && (
                    <div className="pl-[12px] mt-[-4px] text-slate-400 mb-[4px]">{commentData.time}</div>
                )}
                <div className="w-full">
                    <TextEditor
                        editable={!commentData}
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
        </div>
    );
}
