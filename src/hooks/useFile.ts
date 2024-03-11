import { useState } from 'react';
import { FileType, fileExtensions } from '~/constant';

export default function useFile(
    initFiles?: Array<FileType>,
): [Array<FileType>, (file: File) => void, (removedIndex: number) => void] {
    const [files, setFiles] = useState<Array<FileType>>(initFiles || []);

    const setAddFile = (file: File) => {
        const extension = file.type.split('/')[1];
        const type = fileExtensions.find((item) => item.extension === extension);

        const newFile = {
            name: file.name,
            path: file.webkitRelativePath,
            extension: type ? type.extension : 'unknown',
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
