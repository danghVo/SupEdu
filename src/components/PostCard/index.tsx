import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faCaretDown, faCaretUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { RawDraftContentState, convertToRaw } from 'draft-js';
import Image from 'next/image';

import { FileType, TimeData, buttonActionName, fileExtensions, postType } from '~/constant';
import Button from '../Button';
import TextEditor from '../TextEditor';
import Selection from '../Selection';
import Vote, { VoteData } from './Vote';
import InputFile from '../Input/InputFile';
import TimeSetterBox from './TimeSetterBox';
import Modal from '../Modal';
import Comment, { CommentData } from './Comment';
import Input from '../Input';
import checkTimeExprire from '../TextEditor/utils/checkTimeExpire';
import TimeTaskEnd from './TimeTaskEnd';
import { requiredRule } from '../Input/rules';
import { Fuggles } from 'next/font/google';

const currentDay = new Date();

export interface PostData {
    title: string;
    type: string;
    timePost: TimeData;
    content: string | null;
    files: Array<FileType>;
    timeTaskEnd?: TimeData;
    voteData: VoteData | null;
    comments?: Array<CommentData>;
}

export default function PostCard({
    postData,
    isPreview = false,
    edit = true,
    handleSubmit = () => {},
}: {
    postData?: PostData;
    isPreview?: boolean;
    edit?: boolean;
    handleSubmit?: (payload: any) => void;
}) {
    const [type, setType] = useState(
        postData?.type ? postType.find((type) => type.submit === postData.type)!.name : postType[0].name,
    );
    const [timeTaskEnd, setTimeTaskEnd] = useState<TimeData>(
        postData?.timeTaskEnd || {
            date: `${currentDay.getDate() + 1}/${currentDay.getMonth() + 1}/${currentDay.getFullYear()}`,
            time: `${currentDay.getHours()}:${currentDay.getMinutes() <= 9 ? '0' + currentDay.getMinutes() : currentDay.getMinutes()}`,
        },
    );

    const [title, setTitle] = useState(postData?.title || '');

    const [rawContentState, setRawContentState] = useState<RawDraftContentState | null>(
        postData?.content ? JSON.parse(postData.content) : null,
    );

    const [voteData, setVoteData] = useState<VoteData | null>(postData?.voteData || null);

    const [files, setFiles] = useState<Array<FileType>>(
        postData?.files
            ? postData.files.map((file) => ({
                  name: file.name,
                  extension:
                      fileExtensions.find((extension) => extension.extension === file.extension)?.extension ||
                      'unknown',
                  color: fileExtensions.find((extension) => extension.extension === file.extension)?.color || 'black',
                  path: file.path,
              }))
            : [],
    );
    const [filesBuffer, setFilesBuffer] = useState<Array<File>>([]);

    const [openTimeSetterModal, setOpenTimeSetterModal] = useState(false);
    const [timePost, setTimePost] = useState<TimeData>(
        postData?.timePost || {
            date: `${currentDay.getDate()}/${currentDay.getMonth() + 1}/${currentDay.getFullYear()}`,
            time: `${currentDay.getHours()}:${currentDay.getMinutes()}`,
        },
    );

    const [buttonAction, setButtonAction] = useState({ label: buttonActionName[0], openOption: false });
    const [error, setError] = useState('');

    const [isViewComment, setIsViewComment] = useState(false);

    const handleAddFile = (file: File) => {
        const url = URL.createObjectURL(file);
        const extension = file.type.split('/')[1];
        const type = fileExtensions.find((item) => item.extension === extension);

        const newFile = {
            extension: type ? type.extension : 'unknown',
            color: type ? type.color : 'black',
            name: file.name,
            path: url,
        };

        console.log(file);

        setFiles((prev) => {
            return [...prev, newFile];
        });

        setFilesBuffer((prev) => [...prev, file]);
    };

    const handleRemoveFile = (removedIndex: number) => {
        const newFiles = files.filter((item, index) => index !== removedIndex);
        const newFilesBuffer = filesBuffer.filter((item, index) => index !== removedIndex);

        setFiles(newFiles);
        setFilesBuffer(newFilesBuffer);
    };

    const validInput = () => {
        if (type === 'Bình chọn' && voteData) {
            if (voteData.options.find((item) => item.value === '')) {
                return false;
            }
        }

        if (rawContentState === null && type !== 'Bình chọn') {
            return false;
        }

        if (title === '') {
            return false;
        }

        return true;
    };

    const handleCreatePost = () => {
        if (!validInput()) {
            setError('Vui lòng điền đầy đủ thông tin');
        } else {
            setError('');
            console.log(filesBuffer);
            handleSubmit({
                type: postType.find((item) => item.name === type)!.submit,
                title: title || 'Không có tiêu đề',
                timeTaskEnd,
                timePost,
                files: filesBuffer,
                content: JSON.stringify(rawContentState || ''),
                voteData: type === 'Bình chọn' ? voteData : undefined,
            });
        }
    };

    const handleClickSubmitButton = () => {
        if (buttonAction.label === 'Đặt hẹn') {
            setOpenTimeSetterModal(true);
        }

        handleCreatePost();
    };

    return (
        <>
            <div className={`w-[70%] ${isPreview ? 'cursor-pointer mb-[-32px]' : ''}`}>
                {edit && error && (
                    <div className="w-full bg-red-200 text-red-500 rounded-full px-[24px] py-[12px] mb-[8px]">
                        {error}
                    </div>
                )}
                <div className="bg-white shadow-custom-2 rounded-[16px] py-[12px] px-[16px]">
                    <div className={`flex items-center justify-between ${isPreview ? '' : 'mb-[16px]'}`}>
                        {edit ? (
                            <Selection
                                optionData={postType.map((item) => item.name)}
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
                            <TimeTaskEnd edit={edit} timeTaskEnd={timeTaskEnd} setTimeTaskEnd={setTimeTaskEnd} />
                        )}
                    </div>

                    {edit ? (
                        <div className="mb-[16px]">
                            <Input
                                placeholder="Tiêu đề"
                                value={title}
                                rules={[requiredRule]}
                                className=""
                                onChange={(value) => {
                                    setTitle(value);
                                }}
                            />
                        </div>
                    ) : (
                        !isPreview && <div className="text-[24px] font-bold pl-[8px]">{title}</div>
                    )}

                    {type !== 'Bình chọn' && !isPreview && (
                        <TextEditor
                            className="mt-[12px]"
                            editable={edit}
                            rawContentState={rawContentState}
                            onChange={setRawContentState}
                            label="Nội dung"
                        />
                    )}

                    {type === 'Bình chọn' && (
                        <Vote edit={!postData?.voteData} voteData={voteData} onChange={setVoteData} />
                    )}
                    {files.length > 0 && !isPreview && (
                        <div className="px-[12px] mt-[16px]">
                            <div className="text-[18px] font-semibold">Tập tin: </div>
                            <div className="grid grid-cols-3 gap-y-[8px]">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            borderColor: file.color || 'black',
                                        }}
                                        className={`border-2 w-[200px] h-[50px] px-[12px] flex items-center rounded-lg my-[12px]`}
                                    >
                                        <Image
                                            src={require(`~/assets/extension/${file.extension}.png`)}
                                            className="bg-contain w-fit max-h-full py-[8px] pr-[8px]"
                                            alt="file-type"
                                        />
                                        <a
                                            href={file.path}
                                            target="_blank"
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
                            {type !== 'Bình chọn' && (
                                <div className="mt-[12px] text-[20px]">
                                    <InputFile onChange={handleAddFile} multiple>
                                        <FontAwesomeIcon
                                            className="cursor-pointer hover:bg-slate-200 py-[12px] px-[12px] rounded-full"
                                            icon={faArrowUpFromBracket}
                                        />
                                    </InputFile>
                                </div>
                            )}
                            <div className="flex relative z-[20] ml-auto">
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
