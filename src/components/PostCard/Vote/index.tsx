import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SyntheticEvent, useEffect, useState } from 'react';
import Button from '~/components/Button';

interface VoteItem {
    value: string;
    percentage: number;
}

export interface VoteData {
    id?: string;
    title: string;
    option: Array<VoteItem>;
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
    const [option, setOption] = useState<Array<VoteItem>>([
        { value: '', percentage: 0 },
        { value: '', percentage: 0 },
    ]);
    const [selection, setSelection] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (voteData) {
            setOption(voteData.option);
            setTitle(voteData.title);
        }
    }, []);

    useEffect(() => {
        if (!error) {
            onChange({
                title,
                option,
            });
        }
    }, [title, option]);

    useEffect(() => {});

    const handleChangeOption = (e: any, index: number) => {
        const value = e.target.value;

        if (option.find((item) => item.value === value)) {
            setError('Không được có lựa chọn trùng nhau');
        } else if (error) {
            setError('');
        }

        option[index].value = value;

        setOption([...option]);
    };

    const hanldeAddNewOption = () => {
        setOption((prev) => [...prev, { value: '', percentage: 0 }]);
    };

    const handleRemoveSelection = (removedIndex: number) => {
        if (option.length > 2) {
            setOption((prev) => prev.filter((item, index) => index !== removedIndex));
        } else {
            setError('Không được có ít hơn 2 lựa chọn');
        }
    };

    const handleChooseOption = (selection: string) => {
        if (!edit) {
            setSelection(selection);

            if (voteData?.id) {
                // POST selection
            }
        }
    };

    const handleClear = () => {
        setTitle('');
        setOption(Array(2).fill({ value: '', percentage: 0 }));
    };

    return (
        <div className="my-[16px] mx-[32px]">
            <div className="font-semibold text-[18px] mb-[16px]">Bình chọn:</div>
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
                <div className="text-[18px] font-bold">{title}</div>
            )}
            <div className="mx-[16px] my-[12px]">
                {option.map((item, index) => (
                    <div
                        className={`px-[12px] my-[16px] shadow-custom-4 rounded-full overflow-hidden flex items-center ${selection === item.value && !edit ? 'border-2 border-green-500' : ''}`}
                        key={index}
                    >
                        <div
                            className={`cursor-pointer h-[16px] flex items-center ${
                                selection === item.value && !edit
                                    ? 'relative before:content-[""] before:block before:absolute before:top-0 before:w-full before:h-full before:bg-green-500 before:rounded-full'
                                    : ''
                            }`}
                        >
                            <FontAwesomeIcon icon={faCircle} onClick={() => handleChooseOption(item.value)} />
                        </div>
                        <input
                            className="px-[8px] py-[8px] w-full outline-none"
                            placeholder={`Lựa chọn ${index + 1}`}
                            value={item.value}
                            readOnly={!edit}
                            onChange={(e) => handleChangeOption(e, index)}
                        />
                        {edit && (
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="cursor-pointer px-[4px]"
                                onClick={() => handleRemoveSelection(index)}
                            />
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
