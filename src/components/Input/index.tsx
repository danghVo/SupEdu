import classNames from 'classnames/bind';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

import { useValid } from '~/hooks';
import styles from './Input.module.scss';

interface rule {
    valid: (checkedData: string) => { message: string; isValid: boolean };
}

interface InputProps {
    value: string;
    label?: string;
    textArea?: boolean;
    inputType?: string;
    rules?: Array<rule>;
    onChange: (e: React.ChangeEvent) => void;
    placeholder: string;
    iconNode?: React.ReactNode;
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

function Input({
    value = '',
    label = '',
    inputType = 'text',
    textArea = false,
    rules = [],
    onChange,
    placeholder,
    iconNode = null,
}: InputProps) {
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

    const handleOnChange = (e: React.ChangeEvent) => {
        onChange(e);
    };

    const InputTag = textArea ? 'textarea' : 'input';

    return (
        <div className="w-full mt-8">
            {label && (
                <label className="font-semibold mb-4 block" htmlFor={label}>
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {iconNode && <div className="mr-4 text-4xl">{iconNode}</div>}
                <FontAwesomeIcon
                    icon={faXmark}
                    className="absolute top-[50%] translate-y-[-50%] right-[16px] cursor-pointer px-1 text-slate-600 text-3xl"
                />
                <input
                    id={label}
                    type={inputType}
                    className="w-full pl-8 pr-4 py-6  outline-none rounded-[25px] shadow-custom-2"
                    onKeyUp={handleKeyUp}
                    value={value}
                    autoComplete="off"
                    data-error={message}
                    onChange={handleOnChange}
                    placeholder={placeholder}
                />
                {statusIcon.name && (
                    <FontAwesomeIcon
                        icon={statusIcon.name}
                        className={`absolute top-[50%] translate-y-[-50%] right-[40px] text-[${statusIcon.color}]`}
                    />
                )}
            </div>
            {errMess && <div className={cs('input-message')}>{errMess}</div>}
        </div>
    );
}

export default Input;
