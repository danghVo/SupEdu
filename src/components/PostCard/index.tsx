import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faCaretDown, faEraser, faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { RawDraftContentState } from 'draft-js';
import Image from 'next/image';

import { FileType, TimeData, buttonActionName, fileExtensions, postType } from '~/constant';
import Button from '../Button';
import TextEditor from '../TextEditor';
import Selection from '../Selection';
import Vote, { VoteData } from './Vote';
import InputFile from '../Input/InputFile';
import TimeSetterBox from './TimeSetterBox';
import Modal from '../Modal';
import Input from '../Input';
import TimeTaskEnd from './TimeTaskEnd';
import { requiredRule } from '../Input/rules';
import ConfirmModal from '../Modal/ConfirmModal';
import { PostController } from '~/controller';
import Comments from './Comments';
import initTimeTaskEnd from '../../utils/initTimeTaskEnd';
import Loading from '../Loading';
import { useClass } from '~/hooks';

const currentDay = new Date();
const lastDayOfCurrentMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0);

export interface PostData {
    uuid?: string;
    title: string;
    type: string;
    timePost: TimeData;
    content: string | null;
    files: Array<FileType>;
    timeTaskEnd?: TimeData;
    voteData: VoteData | null;
}

export default function PostCard({
    classUuid = '',
    postData,
    isPreview = false,
    edit = true,
    handleSubmit = () => new Promise((resolve) => resolve(true)),
    editable = false,
    onDelete = () => {},
    onUpdate = () => {},
}: {
    classUuid?: string;
    postData?: PostData;
    isPreview?: boolean;
    edit?: boolean;
    handleSubmit?: (payload: any) => Promise<boolean>;
    editable?: boolean;
    onDelete?: (isSuccess: boolean) => void;
    onUpdate?: (isSuccess: boolean) => void;
}) {
    const [type, setType] = useState(
        postData?.type ? postType.find((type) => type.submit === postData.type)!.name : postType[0].name,
    );
    const [timeTaskEnd, setTimeTaskEnd] = useState<TimeData>(postData?.timeTaskEnd || initTimeTaskEnd());

    const [title, setTitle] = useState(postData?.title || '');

    const [rawContentState, setRawContentState] = useState<RawDraftContentState | null>(
        postData?.content ? JSON.parse(postData.content) : null,
    );

    const [voteData, setVoteData] = useState<VoteData | null>(postData?.voteData || null);

    const [files, setFiles] = useState<Array<FileType>>(
        postData?.files
            ? postData.files.map((file) => ({
                  uuid: file.uuid,
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
            date: `${currentDay.getDate() < 10 ? '0' : ''}${currentDay.getDate()}/${currentDay.getMonth() + 1 < 10 ? '0' : ''}${currentDay.getMonth() + 1}/${currentDay.getFullYear()}`,
            time: `${currentDay.getHours() < 10 ? '0' : ''}${currentDay.getHours()}:${currentDay.getMinutes() < 10 ? '0' : ''}${currentDay.getMinutes()}`,
        },
    );

    const [error, setError] = useState('');

    const [isShowEdit, setIsShowEdit] = useState(false);
    const [editMode, setEditMode] = useState(edit);
    const [buttonAction, setButtonAction] = useState({
        label: edit ? buttonActionName[0] : 'Sửa đổi',
        openOption: false,
    });
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const { data } = useClass(classUuid);

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

        setFiles((prev) => {
            return [...prev, newFile];
        });

        setFilesBuffer((prev) => [...prev, file]);
    };

    const handleRemoveFile = (removedIndex: number, isInBuffer: boolean) => {
        const newFiles = files.filter((item, index) => index !== removedIndex);
        if (isInBuffer) {
            const newFilesBuffer = filesBuffer.filter((item, index) => index !== removedIndex);
            setFilesBuffer(newFilesBuffer);
        }

        setFiles(newFiles);
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

    const handleCreatePost = async () => {
        if (!validInput()) {
            setError('Vui lòng điền đầy đủ thông tin');
        } else {
            setError('');
            setLoading(true);

            const res = await handleSubmit({
                type: postType.find((item) => item.name === type)!.submit,
                title: title,
                timeTaskEnd,
                timePost,
                files: filesBuffer,
                content: JSON.stringify(rawContentState || ''),
                voteData: type === 'Bình chọn' ? voteData : undefined,
            });

            setLoading(false);
        }
    };

    const handleDeletePost = async (postUuid: string) => {
        const postController = new PostController();

        const res = await postController.deletePost(classUuid, postUuid);

        onDelete(!res.error);
    };

    const handleUpdatePost = async (postUuid: string, updatePostData: any) => {
        const postController = new PostController();

        setLoading(true);

        if (postData!.title === updatePostData.title) {
            delete updatePostData.title;
        }

        if (postData!.content!.localeCompare(updatePostData.content) !== 0) {
            delete updatePostData.content;
        }

        if (
            postData!.timeTaskEnd!.time === updatePostData.timeTaskEnd.time &&
            postData!.timeTaskEnd!.date === updatePostData.timeTaskEnd.date
        ) {
            delete updatePostData.timeTaskEnd;
        }

        updatePostData.filesUpdate = updatePostData.filesUpdate
            .filter((file: FileType) => postData!.files.find((f: FileType) => f.uuid === file?.uuid))
            .map((file: FileType) => file.uuid);

        const res = await postController.updatePost(classUuid, updatePostData, postUuid);

        onUpdate(!res.error);
        setLoading(false);
    };

    const handleClickSubmitButton = () => {
        if (buttonAction.label === 'Đặt hẹn') {
            setOpenTimeSetterModal(true);
        }

        if (!edit && editMode === true) {
            handleUpdatePost(postData?.uuid!, {
                type: postType.find((item) => item.name === type)!.submit,
                title: title,
                content: JSON.stringify(rawContentState || ''),
                timeTaskEnd,
                filesUpdate: files,
                files: filesBuffer,
                voteData: type === 'Bình chọn' ? voteData : null,
            });
        } else handleCreatePost();

        setEditMode((prev) => !prev);
    };

    return (
        <>
            <div className={`w-[70%] ${isPreview ? 'cursor-pointer mb-[-32px]' : ''}`}>
                {editMode && error && (
                    <div className="w-full bg-red-200 text-red-500 rounded-full px-[24px] py-[12px] mb-[8px]">
                        {error}
                    </div>
                )}
                <div
                    onMouseEnter={() => editable && setIsShowEdit(true)}
                    onMouseLeave={() => setIsShowEdit(false)}
                    className="relative bg-white shadow-custom-2 rounded-[16px] py-[12px] px-[16px]"
                >
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            <AnimatePresence>
                                {isShowEdit && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="after:content-[''] after:block after:absolute after:top-0 after:right-full after:w-[48px] after:h-[120%] absolute top-0 right-[-48px]"
                                    >
                                        <motion.div
                                            initial={{ backgroundColor: 'rgb(255, 255, 255)' }}
                                            animate={
                                                editMode
                                                    ? { backgroundColor: 'rgb(96, 165, 250)' }
                                                    : { backgroundColor: 'rgb(255, 255, 255)' }
                                            }
                                            onClick={(e) => {
                                                if (!isPreview) {
                                                    e.stopPropagation();
                                                    setEditMode((prev) => !prev);
                                                }
                                            }}
                                            className={`w-[32px] h-[32px] shadow-custom-1 rounded-full flex items-center justify-center cursor-pointer ${editMode ? 'text-white' : ''}`}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </motion.div>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenConfirmModal(true);
                                            }}
                                            className="w-[32px] h-[32px] bg-white shadow-custom-1 rounded-full flex items-center justify-center mt-[16px] cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faEraser} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
                                    <TimeTaskEnd
                                        edit={editMode}
                                        timeTaskEnd={timeTaskEnd}
                                        setTimeTaskEnd={setTimeTaskEnd}
                                    />
                                )}
                            </div>

                            {editMode ? (
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
                                    editable={editMode}
                                    rawContentState={rawContentState}
                                    onChange={setRawContentState}
                                    label="Nội dung"
                                />
                            )}

                            {type === 'Bình chọn' && (
                                <Vote
                                    expireTime={postData?.timeTaskEnd}
                                    classUuid={classUuid}
                                    edit={editMode}
                                    voteData={voteData}
                                    onChange={setVoteData}
                                />
                            )}
                            {files.length > 0 && !isPreview && (
                                <div className="px-[12px] mt-[16px]">
                                    <div className="text-[18px] font-semibold">Tập tin: </div>
                                    <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-y-[8px]">
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
                                                {editMode && (
                                                    <div
                                                        className="h-full flex items-center cursor-pointer pl-[8px]"
                                                        onClick={() => handleRemoveFile(index, !file?.uuid)}
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {editMode && (
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
                                            className={`${edit ? 'rounded-none rounded-l-lg' : 'rounded-lg'} w-[80px]`}
                                        >
                                            {buttonAction.label}
                                        </Button>
                                        {edit && (
                                            <div
                                                className="grow flex items-center justify-center bg-black px-[12px] text-white rounded-tr-lg rounded-br-lg cursor-pointer"
                                                onClick={() =>
                                                    setButtonAction((prev) => ({
                                                        ...prev,
                                                        openOption: !prev.openOption,
                                                    }))
                                                }
                                            >
                                                <FontAwesomeIcon icon={faCaretDown} />
                                            </div>
                                        )}

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
                                                            onClick={() =>
                                                                setButtonAction({ label: item, openOption: false })
                                                            }
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
                        </>
                    )}
                </div>

                {!editMode && !isPreview && postData?.uuid && (
                    <div style={{ color: data?.textColor || 'black' }}>
                        <Comments postUuid={postData.uuid} />
                    </div>
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

            {openConfirmModal && (
                <ConfirmModal
                    title="Bạn có chắc chắn muốn xóa không ?"
                    handleYes={() => handleDeletePost(postData?.uuid!)}
                    handleCloseModal={() => {
                        setOpenConfirmModal(false);
                    }}
                />
            )}
        </>
    );
}
