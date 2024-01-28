import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SyntheticEvent, useState } from 'react';
import Button from '~/components/Button';

export default function Vote({ edit }: { edit: boolean }) {
    const [title, setTitle] = useState('');
    const [option, setOption] = useState<Array<{ value: string; percentage: number }>>([
        { value: '', percentage: 0 },
        { value: '', percentage: 0 },
    ]);
    const [error, setError] = useState('');

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

    const handleSubmit = () => {
        if (!error) {
            if (title && !option.find((item) => !item.value)) {
                // Submit
            } else setError('Không được bỏ trống nội dung');
        }
    };

    const handleClear = () => {
        setTitle('');
        setOption(Array(2).fill({ value: '', percentage: 0 }));
    };

    return (
        <div className="my-[24px] mx-[32px]">
            <div className="font-semibold text-[18px] mb-[16px]">Bình chọn:</div>
            {error && (
                <div className="text-red-600 my-[12px] mx-[12px] flex justify-between items-center  ">
                    {error}
                    <FontAwesomeIcon icon={faXmark} onClick={() => setError('')} className="mr-[16px] cursor-pointer" />
                </div>
            )}
            <input
                placeholder="Tiêu đề"
                className="outline-none w-full px-[16px] py-[8px] rounded-full shadow-custom-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="mx-[16px] my-[12px]">
                {option.map((item, index) => (
                    <div
                        className="px-[12px] my-[16px] shadow-custom-4 rounded-full overflow-hidden flex items-center"
                        key={index}
                    >
                        <FontAwesomeIcon icon={faCircle} />
                        <input
                            className="px-[8px] py-[8px] w-full outline-none"
                            placeholder={`Lựa chọn ${index + 1}`}
                            value={item.value}
                            onChange={(e) => handleChangeOption(e, index)}
                        />
                        <FontAwesomeIcon
                            icon={faXmark}
                            className="cursor-pointer px-[4px]"
                            onClick={() => handleRemoveSelection(index)}
                        />
                    </div>
                ))}
                <div
                    className="px-[12px] py-[8px] my-[16px] shadow-custom-4 rounded-full overflow-hidden flex items-center cursor-pointer"
                    onClick={hanldeAddNewOption}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-[8px]" />
                    Thêm lựa chọn
                </div>
            </div>

            <div className="mt-[24px] flex items-center gap-[12px] justify-end">
                {/* <Button handleClick={handleSubmit}>Xong</Button> */}
                <Button className="border-slate-400 border-2" handleClick={handleClear}>
                    Reset
                </Button>
            </div>
        </div>
    );
}
