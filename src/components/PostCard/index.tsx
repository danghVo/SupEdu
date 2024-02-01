import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faCaretDown, faPaperclip, faXmark } from '@fortawesome/free-solid-svg-icons';

import { FileType, TimeData, buttonActionName, fileTypes, postType } from '~/constant';
import Button from '../Button';
import TextEditor from '../TextEditor';
import Selection from '../Selection';
import Vote from './Vote';
import InputFile from '../Input/InputFile';
import Image from 'next/image';
import TimeSetterModal from './TimeSetterModal';

export default function PostCard({ edit = true }: { edit: boolean }) {
    const [type, setType] = useState(postType[0]);
    const [buttonAction, setButtonAction] = useState({ label: buttonActionName[0], openOption: false });
    const [files, setFiles] = useState<Array<FileType>>([]);
    const [openTimeSetterModal, setOpenTimeSetterModal] = useState(false);
    const [timeData, setTimeData] = useState<TimeData>({
        date: '',
        time: 0,
    });

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

    return (
        <>
            <div className="bg-white w-[70%] shadow-custom-2 rounded-[16px] py-[12px] px-[16px]">
                <Selection
                    optionData={postType}
                    label="Loại"
                    onChange={(type) => setType(type)}
                    className="bg-[var(--text-color)] text-white rounded-full mb-[16px]"
                />

                <TextEditor label="Nội dung" />

                {type === 'Vote' && <Vote edit />}
                {files.length > 0 && (
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
                                    <div
                                        className="h-full flex items-center cursor-pointer pl-[8px]"
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mt-[24px]">
                    <div className="mt-[12px] text-[20px]">
                        <InputFile ref={fileRef} onChange={handleAddFile}>
                            <FontAwesomeIcon
                                className="cursor-pointer hover:bg-slate-200 py-[12px] px-[12px] rounded-full"
                                icon={faArrowUpFromBracket}
                            />
                        </InputFile>
                    </div>
                    <div className="flex relative ">
                        <Button
                            handleClick={() => {
                                if (buttonAction.label === 'Đặt hẹn') setOpenTimeSetterModal(true);
                            }}
                            className="rounded-none rounded-tl-lg rounded-bl-lg"
                        >
                            {buttonAction.label}
                        </Button>
                        <div
                            className="grow flex items-center justify-center bg-black px-[12px] text-white rounded-tr-lg rounded-br-lg cursor-pointer"
                            onClick={() => setButtonAction((prev) => ({ ...prev, openOption: !prev.openOption }))}
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
            </div>

            <TimeSetterModal
                isOpen={openTimeSetterModal}
                handleCloseModal={() => {
                    setOpenTimeSetterModal(false);
                }}
                onChange={setTimeData}
            />
        </>
    );
}
