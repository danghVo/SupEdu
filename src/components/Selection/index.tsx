import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Selection({
    label = '',
    optionData,
    className = '',
    bgTheme = 'var(--text-color)',
    onChange,
    defaultSelection,
}: {
    label?: string;
    optionData: Array<string>;
    className?: string;
    onChange: (selection: string) => void;
    bgTheme?: string;
    defaultSelection?: string;
}) {
    const [selection, setSelection] = useState(defaultSelection || optionData[0]);
    const [openOption, setOpenOption] = useState(false);

    const handleChooseSelection = (event: React.MouseEvent, selection: string) => {
        onChange(selection);
        event.stopPropagation();
        setSelection(selection);
        setOpenOption(false);
    };

    return (
        <div
            className={'relative px-[18px] py-[8px] cursor-pointer w-[250px] ' + className}
            onClick={() => setOpenOption((prev) => !prev)}
        >
            <div className="truncate">
                {label ? label + ':' : ''} <span>{selection}</span>
            </div>

            <AnimatePresence>
                {openOption && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'fit-content' }}
                        exit={{ height: 0 }}
                        className={`absolute top-[120%] right-0 left-0 w-full bg-white text-black z-30 rounded-lg overflow-hidden shadow-custom-2`}
                    >
                        {optionData.map((item, index) => (
                            <div
                                onClick={(event) => handleChooseSelection(event, item)}
                                key={index}
                                className={`px-[16px] py-[12px] cursor-pointer hover:bg-[var(--text-color)] hover:text-white ${
                                    selection === item ? 'bg-[var(--text-color)] text-white' : ''
                                }`}
                            >
                                {item}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
