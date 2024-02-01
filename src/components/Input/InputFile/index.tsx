import classNames from 'classnames/bind';

import styles from './InputFile.module.scss';
import {
    ChangeEvent,
    FormEvent,
    Ref,
    SyntheticEvent,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import Input from '../index';

const cs = classNames.bind(styles);

interface InputFileProps {
    children?: React.ReactNode;
    label?: string;
    file?: string;
    isRequire?: boolean;
    onChange: (files: File) => void;
}

function InputFile(
    { children, label, file, isRequire = false, onChange }: InputFileProps,
    forwardRef: Ref<{ getFiles: () => Array<File> }>,
) {
    const [addFile, setAddFile] = useState('');

    useEffect(() => {
        if (file) setAddFile(file);
    }, [file]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        const newFile = fileList?.item(fileList.length - 1);

        if (newFile) {
            onChange(newFile);
        }
    };

    const handleAddFile = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleOpenInputFile = (e: SyntheticEvent) => {
        inputRef.current?.click();
    };

    return (
        <div className={cs('wrapper')}>
            {<div onClick={handleOpenInputFile}>{children}</div> || (
                <>
                    {label && <div className={cs('label')}>{label}</div>}
                    <div className={cs('input')}>
                        <div className={cs('btn')} onClick={handleAddFile}>
                            Choose a file
                        </div>
                        <div className={cs('file-name')}>{file}</div>
                    </div>
                </>
            )}

            {isRequire && !file && <div className={cs('required')}>Không được để trống</div>}
            <div className="hidden">
                <Input value={addFile} inputType="file" accept="*" rules={[]} onChange={handleFile} ref={inputRef} />
            </div>
        </div>
    );
}

export default forwardRef(InputFile);
