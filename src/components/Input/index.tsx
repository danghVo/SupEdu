import classNames from 'classnames/bind';
import { KeyboardEventHandler, Ref, forwardRef, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faEraser, faXmark } from '@fortawesome/free-solid-svg-icons';

import { useValid } from '~/hooks';
import styles from './Input.module.scss';

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
    placeholder?: string;
    iconNode?: React.ReactNode;
    className?: string;
    onFocus?: (e: React.FormEvent<EventTarget>) => void;
    onBlur?: (e: React.FormEvent<EventTarget>) => void;
    accept?: string;
}

const cs = classNames.bind(styles);

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
        placeholder = '',
        className = '',
        iconNode = null,
        onFocus = (e) => {},
        onBlur = (e) => {},
        accept,
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

    const InputTag = textArea ? 'textarea' : 'input';

    return (
        <div className="w-full mt-8">
            {label && (
                <label className="font-semibold mb-4 block" htmlFor={label}>
                    {label}
                </label>
            )}
            <div className="relative flex items-center bg-white shadow-custom-2 rounded-[25px] overflow-hidden">
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
                        className={`w-full ${statusIcon.name ? 'pl-4' : 'pl-12'} pr-2 py-6 outline-none ${className}`}
                        onKeyUp={handleKeyUp}
                        value={value}
                        autoComplete="off"
                        data-error={message}
                        onChange={(e) => {
                            onChange(e.target.value);
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
            {errMess && <div className={cs('input-message')}>{errMess}</div>}
        </div>
    );
}

export default forwardRef(Input);
