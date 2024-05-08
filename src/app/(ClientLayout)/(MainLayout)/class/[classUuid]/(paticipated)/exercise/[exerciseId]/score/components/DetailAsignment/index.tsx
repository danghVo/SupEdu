import Image from 'next/image';
import { motion } from 'framer-motion';

import { fileExtensions, FileType } from '~/constant';

export default function DetailAsignment({ files }: { files: Array<FileType> }) {
    return (
        <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'fit-content' }}
            exit={{ height: 0 }}
            className="w-[80%] rounded-b-lg bg-slate-100/80 shadow-custom-4 overflow-hidden"
        >
            <div className="px-[12px] py-[16px]">
                <div className="font-semibold text-[18px]">Bài nộp</div>
                {files.length > 0 ? (
                    <div className="grid grid-cols-3 px-[12px]">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                style={{ borderColor: file.color }}
                                className={`border-2 w-fit h-[50px] px-[12px] flex items-center rounded-lg my-[12px]`}
                            >
                                <Image
                                    src={
                                        `/extension/${
                                            fileExtensions.find((extension) => extension.extension === file.extension)
                                                ?.extension || 'unknown'
                                        }.png`
                                }
                                    className="bg-contain w-fit max-h-full py-[8px] pr-[8px]"
                                    alt="file-type"
                                    width={20}
                                    height={50}
                                />
                                <a
                                    href={file.path}
                                    download
                                    title={file.name}
                                    className="flex items-center truncate h-full border-l-2 border-inherit px-[8px] grow"
                                >
                                    <span className="truncate text-[13px]">{file.name}</span>
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[60px] mt-[12px] rounded-lg flex items-center justify-center border-2 border-black">
                        Trống
                    </div>
                )}
            </div>
        </motion.div>
    );
}
