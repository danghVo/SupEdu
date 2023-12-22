import classNames from 'classnames/bind';

import styles from './InputFile.module.scss';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Input from '../Input';
import Image from '~/components/Image';

const cs = classNames.bind(styles);

function InputFile({ label, file, handleSetForm, ...passprop }, ref) {
    const [addFile, setAddFile] = useState('');
    const [previewImg, setPreviewImg] = useState('');

    const inputRef = useRef();

    useImperativeHandle(ref, () => ({
        addFile: () => {
            inputRef.current.click();
        },
    }));

    useEffect(() => {
        setPreviewImg(file);
    }, [file]);

    const handleFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (eventReader) => {
            setPreviewImg(eventReader.target.result);
        };

        reader.readAsDataURL(file);

        setAddFile(e.target.value);
        handleSetForm(file);
    };

    const handleAddFile = () => {
        inputRef.current.click();
    };

    return (
        <div className={cs('wrapper')} ref={ref} {...passprop}>
            <div className={cs('label')}>{label}</div>
            <div className={cs('input')}>
                <div className={cs('btn')} onClick={handleAddFile}>
                    Choose a file
                </div>
                <div className={cs('file-name')}>{file}</div>
            </div>

            {previewImg && (
                <div className={cs('preview-img')}>
                    <Image src={previewImg} />
                </div>
            )}

            {!file && <div className={cs('required')}>Không được để trống</div>}
            <Input
                ref={inputRef}
                value={addFile}
                type="file"
                accept="image/png, image/jpeg"
                rules={[]}
                onChange={handleFile}
                className={cs('input-hide')}
            />
        </div>
    );
}

export default forwardRef(InputFile);
