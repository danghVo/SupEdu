import { useState } from 'react';
import { FileType, fileExtensions } from '~/constant';

export default function useFile(): {
    files: Array<FileType>;
    fileBuffers: Array<File>;
    setAddFile: (file: File) => void;
    setRemoveFile: (removedIndex: number, isInBuffer: boolean) => void;
    setInitFiles: (files: Array<any>) => void;
    setClearFiles: () => void;
} {
    const [files, setFiles] = useState<Array<FileType>>([]);
    const [fileBuffers, setFileBuffers] = useState<Array<File>>([]);

    const setAddFile = (file: File) => {
        const url = URL.createObjectURL(file);
        const extension = file.type.split('/')[1];
        const type = fileExtensions.find((item) => item.extension === extension);

        const newFile = {
            name: file.name,
            path: url,
            extension: type ? type.extension : 'unknown',
            color: type ? type.color : 'black',
        };

        setFiles((prev) => {
            return [...prev, newFile];
        });

        setFileBuffers((prev) => [...prev, file]);
    };

    const setRemoveFile = (removedIndex: number, isInBuffer: boolean) => {
        if (isInBuffer) {
            setFileBuffers((prev) => prev.filter((item, index) => index !== removedIndex));
        }
        const newFiles = files.filter((item, index) => index !== removedIndex);

        setFiles(newFiles);
    };

    const setClearFiles = () => {
        setFileBuffers([]);
    }

    const setInitFiles = (files: Array<FileType>) => {
        setFiles(
            files.map((file) => ({
                uuid: file.uuid,
                name: file.name,
                extension:
                    fileExtensions.find((extension) => extension.extension === file.extension)?.extension || 'unknown',
                color: fileExtensions.find((extension) => extension.extension === file.extension)?.color || 'black',
                path: file.path,
            })),
        );
    };

    return { files, fileBuffers, setAddFile, setRemoveFile, setInitFiles, setClearFiles };
}
