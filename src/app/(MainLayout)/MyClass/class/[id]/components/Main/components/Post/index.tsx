import PostCard from '~/components/PostCard';
import testData from './testData.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function Post() {
    const [isNewPost, setIsNewPost] = useState(false);

    return (
        <>
            <div
                onClick={() => {
                    setIsNewPost(true);
                }}
                className="bg-white text-[32px] w-[60px] h-[60px] p-[8px] rounded-full flex items-center justify-center shadow-custom-4 cursor-pointer sticky top-[24px] left-[90%]"
            >
                <FontAwesomeIcon icon={faSquarePlus} />
            </div>
            <div className="flex flex-col items-center gap-[64px]">
                {isNewPost && <PostCard edit />}

                {testData.map((item, index) => (
                    <PostCard key={index} postData={item} edit={false} />
                ))}
            </div>
        </>
    );
}
