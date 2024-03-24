import { faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EditorBlock } from 'draft-js';
import { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';

export default function Video(props: any) {
    const [isLoad, setIsLoad] = useState(false);

    return (
        <div
            onClick={props.blockProps.onClick}
            className={`relative px-[12px] my-[12px] mr-[14px] ${props.blockProps.editable ? ' cursor-text' : ''}`}
        >
            {props.blockProps.src ? (
                <div>
                    {!isLoad && (
                        <div className="w-full h-[300px] flex items-center justify-center bg-slate-200">
                            <motion.span
                                className="text-[20px]"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <FontAwesomeIcon icon={faCircleNotch} />
                            </motion.span>
                        </div>
                    )}
                    <iframe
                        className={`${isLoad ? '' : 'hidden'} w-full h-[350px]`}
                        src={'https://www.youtube.com/embed/' + props.blockProps.src}
                        onLoad={() => setIsLoad(true)}
                    ></iframe>
                    <div className="w-full h-fit bg-white px-[12px] py-[8px] rounded-lg shadow-custom-5 text-blue-500 overflow-hidden">
                        <a target="_blank" href={`https://youtube.com/watch?v=${props.blockProps.src}`}>
                            https://youtube.com/watch?v={props.blockProps.src}
                        </a>
                    </div>
                </div>
            ) : (
                <>
                    <div className="bg-slate-200 px-[12px] py-[8px] rounded-l-lg">
                        <EditorBlock {...props} />
                        {props.blockProps.isError && (
                            <div
                                contentEditable={false}
                                className="text-red-500 mt-[12px] pt-[2px] pointer-events-none"
                            >
                                Đường dẫn không đúng định dạng
                            </div>
                        )}
                    </div>
                </>
            )}
            {props.blockProps.editable && (
                <div
                    className="absolute h-[40px] flex items-center top-0 right-[-10px] text-[18px] bg-black text-white px-[4px] rounded-r-lg cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        props.blockProps.handleRemoveBlock(props.blockProps.blockId);
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            )}
        </div>
    );
}
