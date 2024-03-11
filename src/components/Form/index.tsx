import { useEffect, useRef, useState } from 'react';
import Button from '../Button';
import { motion } from 'framer-motion';

interface FormProps {
    children: React.ReactNode;
    className?: string;
    handleSubmit: () => void;
    errMessage?: { message: string };
    submit: {
        custom?: string;
        content: string;
    };
    customError?: string;
    props?: any;
}

function Form({ children, className = '', handleSubmit, submit, errMessage, customError = '', ...props }: FormProps) {
    const [error, setError] = useState('');
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setError(errMessage?.message || '');
    }, [errMessage]);

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
        setError('');

        if (formElement) {
            const inputElements = formElement.querySelectorAll('input');
            Array.from(inputElements).forEach((inputElement) => {
                const error = inputElement.getAttribute('data-error');
                if (error) {
                    valid = false;
                }
                if (inputElement.value === '' && !inputElement.getAttribute('data-optional')) {
                    valid = false;
                    setError(error || 'Vui lòng nhập đầy đủ thông tin');
                }
            });

            if (valid) {
                setError('');
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
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`bg-red-200 text-red-700 py-[12px] px-[16px] mb-[16px] rounded-2xl ${customError}`}
                >
                    {error}
                </motion.div>
            )}
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
