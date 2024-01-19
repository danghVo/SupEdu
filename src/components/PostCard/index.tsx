import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faCaretDown, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

import { buttonActionName, postType } from '~/constant';
import Button from '../Button';
import TextEditor from '../TextEditor';
import Selection from '../Selection';

export default function PostCard({}) {
    const [type, setType] = useState(postType[0]);
    const [buttonAction, setButtonAction] = useState({ label: buttonActionName[0], openOption: false });

    return (
        <div className="bg-white w-[70%] shadow-custom-2 rounded-[16px] py-[12px] px-[16px]">
            <Selection
                optionData={postType}
                label="Loại"
                onChange={(type) => setType(type)}
                className="bg-[var(--text-color)] text-white rounded-full mb-[16px]"
            />
            <TextEditor label="Nội dung" />

            <div></div>

            <div className="flex justify-between items-center mt-[24px]">
                <div className="mt-[12px] text-[20px]">
                    <FontAwesomeIcon
                        className="cursor-pointer hover:bg-slate-200 py-[12px] px-[12px] rounded-full"
                        icon={faArrowUpFromBracket}
                    />
                    <FontAwesomeIcon
                        className="cursor-pointer hover:bg-slate-200 py-[12px] px-[12px] rounded-full"
                        icon={faYoutube}
                    />
                    <FontAwesomeIcon
                        className="cursor-pointer hover:bg-slate-200 py-[12px] px-[12px] rounded-full"
                        icon={faPaperclip}
                    />
                </div>
                <div className="flex relative ">
                    <Button handleClick={() => {}} className="rounded-none rounded-tl-lg rounded-bl-lg">
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
    );
}
