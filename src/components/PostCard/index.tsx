import { use, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowDown,
    faArrowUpFromBracket,
    faCaretDown,
    faCaretUp,
    faPaperclip,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';

import { FileType, TimeData, buttonActionName, fileTypes, postType } from '~/constant';
import Button from '../Button';
import TextEditor from '../TextEditor';
import Selection from '../Selection';
import Vote, { VoteData } from './Vote';
import InputFile from '../Input/InputFile';
import Image from 'next/image';
import TimeSetterBox from './TimeSetterBox';
import Modal from '../Modal';
import { EditorState, RawDraftContentState } from 'draft-js';
import Comment, { CommentData } from './Comment';
import Input from '../Input';

const currentDay = new Date();

export interface PostData {
    author: string;
    title: string;
    type: string;
    timePost: TimeData;
    rawContentState: RawDraftContentState | null;
    files: Array<FileType>;
    timeTaskEnd?: TimeData;
    voteData?: VoteData;
    comments?: Array<CommentData>;
}

export default function PostCard({
    postData,
    isPreview = false,
    edit = true,
}: {
    postData?: PostData;
    isPreview?: boolean;
    edit?: boolean;
}) {
    const [type, setType] = useState(postData?.type || postType[0]);

    const [openTimeTaskEndBox, setOpenTimeTaskEndBox] = useState(false);
    const [timeTaskEnd, setTimeTaskEnd] = useState<TimeData>(
        postData?.timeTaskEnd || {
            date: `${currentDay.getDate()}/${currentDay.getMonth() + 1}/${currentDay.getFullYear()}`,
            time: `${currentDay.getHours()}:${currentDay.getMinutes()}`,
        },
    );

    const [title, setTitle] = useState(postData?.title || '');

    const [rawContentState, setRawContentState] = useState<RawDraftContentState | null>(
        postData?.rawContentState || null,
    );

    const [voteData, setVoteData] = useState<VoteData | null>(postData?.voteData || null);

    const [files, setFiles] = useState<Array<FileType>>(postData?.files || []);

    const [openTimeSetterModal, setOpenTimeSetterModal] = useState(false);
    const [timePost, setTimePost] = useState<TimeData>(
        postData?.timePost || {
            date: `${currentDay.getDate()}/${currentDay.getMonth() + 1}/${currentDay.getFullYear()}`,
            time: `${currentDay.getHours()}:${currentDay.getMinutes()}`,
        },
    );

    const [buttonAction, setButtonAction] = useState({ label: buttonActionName[0], openOption: false });

    const [isViewComment, setIsViewComment] = useState(false);

    const fileRef = useRef(null);

    const handleAddFile = (file: File) => {
        const extension = file.type.split('/')[1];
        const type = fileTypes.find((type) => type.type === extension);

        const newFile = {
            name: file.name,
            path: file.webkitRelativePath,
            type: type ? type.type : 'unknown',
            color: type ? type.color : 'black',
        };

        setFiles((prev) => {
            return [...prev, newFile];
        });
    };

    const handleRemoveFile = (removedIndex: number) => {
        const newFiles = files.filter((item, index) => index !== removedIndex);

        setFiles(newFiles);
    };

    const handleSubmit = () => {
        console.log({
            type,
            title: title || 'Không có tiêu đề',
            timeTaskEnd,
            timePost,
            files,
            rawContentState,
            voteData,
        });
    };

    const handleClickSubmitButton = () => {
        if (buttonAction.label === 'Đặt hẹn') setOpenTimeSetterModal(true);

        handleSubmit();
    };

    return (
        <>
            <div className={`w-[70%] ${isPreview ? 'cursor-pointer mb-[-32px]' : ''}`}>
                <div className="bg-white shadow-custom-2 rounded-[16px] py-[12px] px-[16px]">
                    <div className={`flex items-center justify-between ${isPreview ? '' : 'mb-[16px]'}`}>
                        {edit ? (
                            <Selection
                                optionData={postType}
                                label="Loại"
                                onChange={(type) => setType(type)}
                                className="bg-[var(--text-color)] text-white rounded-full"
                            />
                        ) : (
                            <div className="flex items-center">
                                <div className="bg-[var(--text-color)] text-white rounded-full text-[18px] px-[12px] py-[8px]">
                                    {type}
                                </div>
                                {isPreview && <div className="text-[24px] font-bold pl-[8px]">{title}</div>}
                            </div>
                        )}

                        {(type === 'Bài tập' || type === 'Bình chọn') && (
                            <div className="relative">
                                <motion.div
                                    initial={{ marginBottom: 0 }}
                                    animate={openTimeTaskEndBox ? { marginBottom: '4px' } : {}}
                                    className={`font-bold ${openTimeTaskEndBox ? 'shadow-custom-4' : ''} text-[18px] px-[8px] py-[4px] rounded-lg cursor-pointer relative`}
                                    onClick={() => {
                                        if (edit) {
                                            setOpenTimeTaskEndBox((prev) => !prev);
                                        }
                                    }}
                                >
                                    <span className="mr-[4px]">Đến hạn: </span>

                                    <span>{timeTaskEnd.time}, </span>
                                    <span>{timeTaskEnd.date}</span>
                                </motion.div>

                                {openTimeTaskEndBox && edit && (
                                    <div className="absolute top-[130%] shadow-custom-1 rounded-lg z-[50] right-0 beofore:content-[''] before:w-[30px] before:border-x-[18px] before:border-y-[20px] before:border-x-transparent before:border-t-transparent before:border-b-white before:block before:absolute before:top-[-30px] before:left-[50%] before:translate-x-[-50%]">
                                        <TimeSetterBox
                                            label="Hết hạn lúc"
                                            handleCloseBox={() => {
                                                setOpenTimeTaskEndBox(false);
                                            }}
                                            onChange={setTimeTaskEnd}
                                            date={timeTaskEnd.date}
                                            time={timeTaskEnd.time}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {edit ? (
                        <div className="mb-[16px]">
                            <Input
                                placeholder="Tiêu đề"
                                value={title}
                                className=""
                                onChange={(value) => {
                                    setTitle(value);
                                }}
                            />
                        </div>
                    ) : (
                        !isPreview && <div className="text-[24px] font-bold pl-[8px]">{title}</div>
                    )}

                    {(type !== 'Bình chọn' || edit || (!edit && rawContentState)) && !isPreview && (
                        <TextEditor
                            className="mt-[12px]"
                            editable={edit}
                            rawContentState={postData?.rawContentState || rawContentState}
                            onChange={setRawContentState}
                            label="Nội dung"
                        />
                    )}

                    {type === 'Bình chọn' && (
                        <Vote
                            edit={!postData?.voteData}
                            voteData={postData?.voteData || voteData}
                            onChange={setVoteData}
                        />
                    )}
                    {files.length > 0 && !isPreview && (
                        <div className="px-[12px] mt-[16px]">
                            <div className="text-[18px] font-semibold">Tập tin: </div>
                            <div className="grid grid-cols-3 gap-y-[8px]">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        style={{ borderColor: file.color }}
                                        className={`border-2 w-[200px] h-[50px] px-[12px] flex items-center rounded-lg my-[12px]`}
                                    >
                                        <Image
                                            src={require(`~/assets/filetype/${file.type}.png`)}
                                            className="bg-contain w-fit max-h-full py-[8px] pr-[8px]"
                                            alt="file-type"
                                        />
                                        <a
                                            href={file.path}
                                            download
                                            title={file.name}
                                            className="flex items-center truncate h-full border-l-2 border-inherit px-[8px] grow"
                                        >
                                            <span className="truncate text-[13px]">{file.name}</span>
                                        </a>
                                        {edit && (
                                            <div
                                                className="h-full flex items-center cursor-pointer pl-[8px]"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {edit && (
                        <div className="flex justify-between items-center mt-[24px]">
                            <div className="mt-[12px] text-[20px]">
                                <InputFile ref={fileRef} onChange={handleAddFile}>
                                    <FontAwesomeIcon
                                        className="cursor-pointer hover:bg-slate-200 py-[12px] px-[12px] rounded-full"
                                        icon={faArrowUpFromBracket}
                                    />
                                </InputFile>
                            </div>
                            <div className="flex relative z-[20]">
                                <Button
                                    handleClick={handleClickSubmitButton}
                                    className="rounded-none rounded-tl-lg rounded-bl-lg w-[80px]"
                                >
                                    {buttonAction.label}
                                </Button>
                                <div
                                    className="grow flex items-center justify-center bg-black px-[12px] text-white rounded-tr-lg rounded-br-lg cursor-pointer"
                                    onClick={() =>
                                        setButtonAction((prev) => ({ ...prev, openOption: !prev.openOption }))
                                    }
                                >
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>

                                <AnimatePresence>
                                    {buttonAction.openOption && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'fit-content' }}
                                            exit={{ height: 0 }}
                                            className="absolute right-0 left-0 top-[110%] bg-white shadow-custom-3 rounded-lg overflow-hidden"
                                        >
                                            {buttonActionName.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={`px-[12px] py-[8px] cursor-pointer hover:bg-slate-800 hover:text-white ${
                                                        item === buttonAction.label ? 'bg-black text-white' : ''
                                                    }`}
                                                    onClick={() => setButtonAction({ label: item, openOption: false })}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>

                {!edit && !isPreview && (
                    <>
                        {postData &&
                            postData.comments &&
                            (isViewComment ? (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'fit-content' }}
                                >
                                    {postData.comments.map((comment, index) => (
                                        <Comment commentData={comment} key={index} />
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
                                    <span className="mr-[12px]">Xem bình luận ({postData.comments.length})</span>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                            ))}

                        <Comment />
                    </>
                )}
            </div>

            {openTimeSetterModal && (
                <Modal
                    width={'fit-content'}
                    height={'fit-content'}
                    handleCloseModal={() => {
                        setOpenTimeSetterModal(false);
                    }}
                >
                    <TimeSetterBox
                        handleCloseBox={() => {
                            setOpenTimeSetterModal(false);
                        }}
                        label="Đăng lúc"
                        time={timePost.time}
                        date={timePost.date}
                        onChange={setTimePost}
                    />
                </Modal>
            )}
        </>
    );
}
