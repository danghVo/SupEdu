import { useEffect, useRef, useState } from 'react';
import Button from '../Button';

interface FormProps {
    children: React.ReactNode;
    header: string;
    handleSubmit: () => void;
    submit: {
        custom?: string;
        content: string;
    };
    customError?: string;
    props?: any;
}

function Form({ children, header, handleSubmit, submit, customError = '', ...props }: FormProps) {
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
        <div ref={formRef} className=" max-w-[450px] flex-col items-center justify-center rounded-xl p-8" {...props}>
            <div className="text-center mb-4 font-bold uppercase">{header}</div>
            {error && <div className={` ${customError}`}>{error}</div>}
            {children}
            <Button
                theme="default"
                className={`mt-8 w-full  ${submit.custom || ''}`}
                handleClick={handleCheckForSubmit}
            >
                {submit.content || 'Gửi'}
            </Button>
        </div>
    );
}

export default Form;
