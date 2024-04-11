import { ChangeEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './InputFile.module.scss';
import Input from '../index';

const cs = classNames.bind(styles);

interface InputFileProps {
    children?: React.ReactNode;
    label?: string;
    file?: string;
    isRequire?: boolean;
    accept?: string;
    multiple?: boolean;
    onChange: (files: File) => void;
}

function InputFile({ children, label, file, isRequire = false, onChange, accept, multiple = false }: InputFileProps) {
    const [addFile, setAddFile] = useState('');

    useEffect(() => {
        if (file) setAddFile(file);
    }, [file]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const newFile = fileList[0];

            if (newFile) {
                onChange(newFile);
                setAddFile(newFile.name);
            }
        }
    };

    const handleOpenInputFile = () => {
        inputRef.current?.click();
    };

    return (
        <div className={cs('wrapper')}>
            {children ? (
                <div onClick={handleOpenInputFile}>{children}</div>
            ) : (
                <>
                    {label && <div className={cs('label')}>{label}</div>}
                    <div className={`${cs('input')}`} onClick={handleOpenInputFile}>
                        <div className={`${cs('btn')} truncate`}>{addFile ? addFile : 'Chọn hình ảnh'}</div>
                    </div>
                </>
            )}

            {isRequire && !file && <div className={cs('required')}>Không được để trống</div>}
            <div className="hidden">
                <Input
                    multiple={multiple}
                    value=""
                    inputType="file"
                    accept={accept || '*'}
                    onChange={() => {}}
                    onFileChange={handleFile}
                    ref={inputRef}
                />
            </div>
        </div>
    );
}

export default InputFile;
