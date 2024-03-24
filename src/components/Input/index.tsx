import { ChangeEvent, KeyboardEventHandler, Ref, forwardRef, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faEraser, faXmark } from '@fortawesome/free-solid-svg-icons';

import useValid from '~/hooks/useValid';

interface rule {
    valid: (checkedData: string) => { message: string; isValid: boolean };
}

export interface InputProps {
    value: string;
    label?: string;
    textArea?: boolean;
    inputType?: string;
    rules?: Array<rule>;
    reset?: boolean;
    onChange: (e: string) => void;
    onFileChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    iconNode?: React.ReactNode;
    className?: string;
    classNameWrapper?: string;
    onFocus?: (e: React.FormEvent<EventTarget>) => void;
    onBlur?: (e: React.FormEvent<EventTarget>) => void;
    accept?: string;
    type?: string;
    multiple?: boolean;
}

const iconStatusName = {
    success: {
        name: faCircleCheck,
        color: '--success',
    },
    warning: {
        name: faCircleExclamation,
        color: '--warning',
    },
};

function Input(
    {
        value = '',
        label = '',
        inputType = 'text',
        textArea = false,
        rules = [],
        reset = true,
        onChange,
        onFileChange,
        placeholder = '',
        className = '',
        classNameWrapper = '',
        iconNode = null,
        onFocus = (e) => {},
        onBlur = (e) => {},
        accept,
        multiple = false,
        type = 'stack',
    }: InputProps,
    forwardRef: Ref<HTMLInputElement> | undefined,
) {
    const [errMess, setErrMess] = useState('');
    const { message } = useValid(value, rules);
    const [statusIcon, setStatusIcon] = useState({ name: null, color: '' });

    const firstRender = useRef(true);

    useEffect(() => {
        if (value !== '') {
            firstRender.current = false;
        }

        if (message && !firstRender.current) {
            setErrMess(message);
        } else setErrMess('');
    }, [message, value]);

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const inputElement = event.currentTarget;
            inputElement.blur();
        }
    };

    return (
        <div className={`max-w-full`}>
            <div className={`${type === 'inline' ? 'flex' : ''}`}>
                {label && (
                    <label
                        className={`font-semibold mb-4 block mt-8 ${type === 'inline' ? 'mx-[12px] w-[100px]' : ''}`}
                        htmlFor={label}
                    >
                        {label}
                    </label>
                )}
                <div
                    className={`${type === 'inline' ? 'grow' : ''} relative flex items-center bg-white shadow-custom-2 rounded-[25px] overflow-hidden ${classNameWrapper}`}
                >
                    {iconNode && <div className="mr-4 text-4xl">{iconNode}</div>}
                    {statusIcon.name && (
                        <FontAwesomeIcon icon={statusIcon.name} className={`pl-6 text-[${statusIcon.color}]`} />
                    )}
                    <div className="grow">
                        <input
                            ref={forwardRef || undefined}
                            id={label}
                            type={inputType}
                            accept={accept}
                            multiple={multiple}
                            className={`w-full ${statusIcon.name ? 'pl-[16px]' : 'pl-[18px]'}  pr-2 py-6 outline-none ${className}`}
                            onKeyUp={handleKeyUp}
                            value={value}
                            autoComplete="off"
                            data-optional={rules.length === 0}
                            data-error={message}
                            onChange={(e) => {
                                if (inputType === 'file' && onFileChange) {
                                    onFileChange(e);
                                } else onChange(e.target.value);
                            }}
                            placeholder={placeholder}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                    </div>
                    {reset && (
                        <FontAwesomeIcon
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onChange('');
                            }}
                            icon={faEraser}
                            className="text-black cursor-pointer px-5 text-3xl"
                        />
                    )}
                </div>
            </div>
            {errMess && (
                <div className="text-red-700 bg-red-200 px-[16px] py-[12px] mt-[16px] rounded-[25px]">{errMess}</div>
            )}
        </div>
    );
}

export default forwardRef(Input);
