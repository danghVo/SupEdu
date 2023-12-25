import { useEffect, useState } from 'react';

interface InputRatioProps {
    selectionData: Array<any>;
    value: string;
    label: string;
    className?: string;
    onChange: (value: string) => void;
}

export default function InputRatio({ selectionData, value, label, className, onChange }: InputRatioProps) {
    const [selection, setSelection] = useState(value);

    useEffect(() => {
        if (value) {
            setSelection(value);
        } else {
            setSelection(selectionData[0].value);
            onChange(selectionData[0].value);
        }
    }, []);

    useEffect(() => {
        if (selection) {
            onChange(selection);
        }
    }, [selection]);

    return (
        <div className="mb-[-8px]">
            <div className="font-semibold text-4xl mb-[-4px] block">{label}</div>
            <div>
                {selectionData.map((item, index) => (
                    <div
                        className="bg-white w-full mx-4 font-medium my-8 py-4 px-8 rounded-full flex items-center shadow-custom-2"
                        key={index}
                    >
                        <div
                            onClick={() => setSelection(item.value)}
                            className={`outline-2 outline outline-black cursor-pointer ${
                                selection === item.value ? 'bg-black' : ''
                            } border-[3px] border-white border-solid w-[20px] h-[20px] rounded-full mr-4`}
                        ></div>
                        {item.ui}
                    </div>
                ))}
            </div>
        </div>
    );
}
