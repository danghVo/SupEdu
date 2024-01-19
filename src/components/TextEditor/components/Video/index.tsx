import { faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EditorBlock } from 'draft-js';
import { Suspense } from 'react';

export default function Video(props: any) {
    return (
        <div {...props.blockProps} className="relative px-[12px] my-[12px] mr-[14px]">
            {props.blockProps.src ? (
                <Suspense
                    fallback={
                        <div className="bg-slate-400 h-full">
                            <FontAwesomeIcon icon={faCircleNotch} />
                        </div>
                    }
                >
                    <iframe
                        className="w-full h-[350px]"
                        src={'https://www.youtube.com/embed/' + props.blockProps.src}
                    ></iframe>
                </Suspense>
            ) : (
                <>
                    <div className="bg-slate-200 px-[12px] py-[8px] rounded-l-lg">
                        <EditorBlock {...props} />
                        {props.blockProps.isError && (
                            <div className="text-red-500 mt-[12px] pt-[2px]">Đường dẫn không đúng định dạng</div>
                        )}
                    </div>
                </>
            )}
            <div
                className="absolute h-[40px] flex items-center top-0 right-[-10px] text-[18px] bg-black text-white px-[4px] rounded-r-lg cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    props.blockProps.handleRemoveBlock(props.blockProps.blockId);
                }}
            >
                <FontAwesomeIcon icon={faXmark} />
            </div>
        </div>
    );
}
