import { useEffect, useState } from 'react';
import Input, { InputProps } from '..';

interface InputOptionProps extends InputProps {
    optionData: Array<string>;
}

export default function InputOption({
    optionData,
    value = '',
    label = '',
    rules = [],
    onChange,
    placeholder = '',
    className = '',
    iconNode = null,
}: InputOptionProps) {
    const [selectedItem, setSelectedItem] = useState('');
    const [openOption, setOpenOption] = useState(false);
    const [isMouseInOption, setIsMouseInOption] = useState(false);

    useEffect(() => {
        if (!value) {
            const firstOption = optionData[0];
            // onChange(firstOption);
            setSelectedItem(firstOption);
        }
    }, []);

    const handleInput = () => {};

    const handleChooseItem = (item: string) => {
        setSelectedItem(item);
        setOpenOption(false);
    };

    const handleBlurInput = (e: React.FormEvent<EventTarget>) => {
        if (openOption && isMouseInOption) {
            e.stopPropagation();
        }
    };

    return (
        <div className="relative" onBlur={() => setOpenOption(false)}>
            <Input
                value={value}
                placeholder={placeholder}
                label={label}
                className={className}
                onChange={handleInput}
                onFocus={() => setOpenOption(true)}
                onBlur={handleBlurInput}
            />
            {openOption && (
                <div
                    onMouseEnter={() => setIsMouseInOption(true)}
                    onMouseLeave={() => setIsMouseInOption(false)}
                    className="absolute top-[110%] shadow-custom-3 w-full bg-white overflow-hidden rounded-3xl py-4 z-10"
                >
                    {optionData.map((item, index) => (
                        <div
                            key={index}
                            className={`px-8 py-4 hover:bg-zinc-950 hover:text-white cursor-pointer ${
                                item === selectedItem ? 'bg-black text-white' : ''
                            }`}
                            onClick={() => handleChooseItem(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
