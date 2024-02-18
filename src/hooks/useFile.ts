import { useState } from 'react';
import { FileType, fileTypes } from '~/constant';

export default function useFile(
    initFiles?: Array<FileType>,
): [Array<FileType>, (file: File) => void, (removedIndex: number) => void] {
    const [files, setFiles] = useState<Array<FileType>>(initFiles || []);

    const setAddFile = (file: File) => {
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

    const setRemoveFile = (removedIndex: number) => {
        const newFiles = files.filter((item, index) => index !== removedIndex);

        setFiles(newFiles);
    };

    return [files, setAddFile, setRemoveFile];
}
