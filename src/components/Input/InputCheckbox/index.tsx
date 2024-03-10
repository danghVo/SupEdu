import { useEffect, useState } from 'react';

interface InputCheckboxProps {
    value: boolean;
    label: string;
    className?: string;
    onChange: (value: boolean) => void;
}

export default function InputCheckbox({ value, label, className, onChange }: InputCheckboxProps) {
    const [choose, setChoose] = useState(false);

    useEffect(() => {
        setChoose(value);
    }, []);

    useEffect(() => {
        onChange(choose);
    }, [choose]);

    return (
        <div className={`${className} mb-[-8px]`}>
            <div className="font-semibold text-[16px] mb-[-4px] block">{label}</div>
            <div
                onClick={() => setChoose((prev) => !prev)}
                className={`outline-2 outline outline-black cursor-pointer ${
                    choose ? 'bg-black' : ''
                } border-[3px] border-white border-solid w-[20px] h-[20px] rounded-full mr-4`}
            ></div>
        </div>
    );
}
