import { useEffect, useRef, useState } from 'react';
import Button from '../Button';

interface FormProps {
    children: React.ReactNode;
    className?: string;
    handleSubmit: () => void;
    submit: {
        custom?: string;
        content: string;
    };
    customError?: string;
    props?: any;
}

function Form({ children, className = '', handleSubmit, submit, customError = '', ...props }: FormProps) {
    const [error, setError] = useState('');
    const formRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const formElement = formRef.current;

        if (formElement) {
            const inputElements = formElement.querySelectorAll('input');

            Array.from(inputElements).forEach((inputElement) => {
                inputElement.nextSibling && inputElement.nextSibling.remove();
            });
        }
    }, []);

    const handleCheckForSubmit = () => {
        let valid = true;
        const formElement = formRef.current;
        const submitElement = submitRef.current;

        if (formElement && submitElement) {
            const inputElements = formElement.querySelectorAll('input');

            Array.from(inputElements).forEach((inputElement) => {
                const error = inputElement.getAttribute('data-error');
                if (inputElement.value === '' && error) {
                    valid = false;
                    setError(error || 'Vui lòng nhập đầy đủ thông tin');
                }
            });

            if (valid) {
                handleSubmit();
            }
        }
    };

    return (
        <div
            ref={formRef}
            className={`max-w-[450px] flex-col items-center justify-center rounded-xl p-8 ${className}`}
            {...props}
        >
            {error && <div className={` ${customError}`}>{error}</div>}
            {children}
            <div className="w-full flex justify-center">
                <Button
                    theme="fill"
                    size="big"
                    className={`mt-16 w-[80%]  ${submit.custom || ''}`}
                    handleClick={handleCheckForSubmit}
                >
                    {submit.content || 'Gửi'}
                </Button>
            </div>
        </div>
    );
}

export default Form;
