import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SyntheticEvent, useEffect, useState } from 'react';
import Button from '~/components/Button';
import { motion } from 'framer-motion';

interface VoteItem {
    uuid?: String;
    content: string;
    percentage: number;
}

export interface VoteData {
    uuid?: string;
    title: string;
    options: Array<VoteItem>;
}

export default function Vote({
    edit,
    voteData,
    onChange,
}: {
    edit: boolean;
    voteData: VoteData | null;
    onChange: (voteDate: VoteData) => void;
}) {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState<Array<VoteItem>>([
        { content: '', percentage: 0 },
        { content: '', percentage: 0 },
    ]);
    const [selection, setSelection] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (voteData) {
            setOptions(voteData.options);
            setTitle(voteData.title);
        }
    }, []);

    useEffect(() => {
        if (!error) {
            onChange({
                title,
                options,
            });
        }
    }, [title, options]);

    useEffect(() => {});

    const handleChangeOption = (e: any, index: number) => {
        const value = e.target.value;

        if (options.find((item) => item.content === value)) {
            setError('Không được có lựa chọn trùng nhau');
        } else if (error) {
            setError('');
        }

        options[index].content = value;

        setOptions([...options]);
    };

    const hanldeAddNewOption = () => {
        setOptions((prev) => [...prev, { content: '', percentage: 0 }]);
    };

    const handleRemoveOption = (removedIndex: number) => {
        if (options.length > 2) {
            setOptions((prev) => prev.filter((item, index) => index !== removedIndex));
        } else {
            setError('Không được có ít hơn 2 lựa chọn');
        }
    };

    const handleChooseOption = (selection: string) => {
        if (!edit) {
            setSelection(selection);

            if (voteData?.uuid) {
                // POST selection
            }
        }
    };

    const handleClear = () => {
        setTitle('');
        setOptions(Array(2).fill({ value: '', percentage: 0 }));
    };

    const handleRemoveSelection = () => {
        setSelection(null);
    };

    return (
        <div className="my-[16px] mx-[32px]">
            {edit && <div className="font-semibold text-[18px] mb-[16px]">Bình chọn:</div>}
            {error && (
                <div className="text-red-600 my-[12px] mx-[12px] flex justify-between items-center  ">
                    {error}
                    <FontAwesomeIcon icon={faXmark} onClick={() => setError('')} className="mr-[16px] cursor-pointer" />
                </div>
            )}
            {edit ? (
                <input
                    placeholder="Tiêu đề"
                    className="outline-none w-full px-[16px] py-[8px] rounded-full shadow-custom-4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            ) : (
                <div className="flex items-center justify-between">
                    <div className="text-[18px] font-bold">{title}</div>

                    {selection && (
                        <div
                            className="underline mr-[16px] font-semibold cursor-pointer"
                            onClick={handleRemoveSelection}
                        >
                            Bỏ lựa chọn
                        </div>
                    )}
                </div>
            )}
            <div className="mx-[16px] my-[12px]">
                {options.map((option, index) => (
                    <div key={index}>
                        <motion.div
                            className={`px-[12px] my-[16px] shadow-custom-4 rounded-full overflow-hidden flex items-center`}
                            initial={{ border: '0px solid transparent' }}
                            animate={
                                selection === option.content && !edit
                                    ? { border: '2px solid green' }
                                    : { border: '0px solid transparent' }
                            }
                            onClick={() => handleChooseOption(option.content)}
                        >
                            <div
                                className={`cursor-pointer h-[16px] flex items-center ${
                                    selection === option.content && !edit
                                        ? 'relative before:content-[""] before:block before:absolute before:top-0 before:w-full before:h-full before:bg-green-500 before:rounded-full'
                                        : ''
                                }`}
                            >
                                <FontAwesomeIcon icon={faCircle} />
                            </div>
                            <input
                                className={`px-[8px] py-[8px] w-full outline-none ${!edit ? 'cursor-pointer' : ''}`}
                                placeholder={`Lựa chọn ${index + 1}`}
                                value={option.content}
                                readOnly={!edit}
                                onChange={(e) => handleChangeOption(e, index)}
                            />
                            {edit && (
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="cursor-pointer px-[4px]"
                                    onClick={() => handleRemoveOption(index)}
                                />
                            )}
                        </motion.div>

                        {selection && !edit && (
                            <div className="flex items-center gap-[16px] px-[8px]">
                                <motion.div
                                    className={`h-[20px] ${selection === option.content ? 'bg-green-500' : 'bg-black'} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: option.percentage + '%' }}
                                ></motion.div>
                                <span className="font-semibold">{option.percentage}%</span>
                            </div>
                        )}
                    </div>
                ))}

                {edit && (
                    <div
                        className="px-[12px] py-[8px] my-[16px] shadow-custom-4 rounded-full overflow-hidden flex items-center cursor-pointer"
                        onClick={hanldeAddNewOption}
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-[8px]" />
                        Thêm lựa chọn
                    </div>
                )}
            </div>

            {edit && (
                <div className="mt-[24px] flex items-center gap-[12px] justify-end">
                    <Button className="border-slate-400 border-2 w-[80px]" handleClick={handleClear}>
                        Reset
                    </Button>
                </div>
            )}
        </div>
    );
}
