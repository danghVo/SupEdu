import { motion } from 'framer-motion';
import { useState } from 'react';
import checkTimeExprire from '~/components/TextEditor/utils/checkTimeExpire';
import TimeSetterBox from '../TimeSetterBox';

export default function TimeTaskEnd({
    edit = false,
    timeTaskEnd,
    setTimeTaskEnd,
}: {
    edit?: boolean;
    timeTaskEnd: { time: string; date: string };
    setTimeTaskEnd: (timeTaskEnd: { time: string; date: string }) => void;
}) {
    const [openTimeTaskEndBox, setOpenTimeTaskEndBox] = useState(false);
    const [error, setError] = useState('');

    return (
        <div className="relative">
            {error && (
                <div className="w-full bg-red-200 text-red-500 rounded-full px-[24px] py-[4px] mb-[8px]">{error}</div>
            )}
            <motion.div
                initial={{ marginBottom: 0 }}
                animate={openTimeTaskEndBox ? { marginBottom: '4px' } : {}}
                className={`font-bold ${openTimeTaskEndBox ? 'shadow-custom-4' : ''} text-[18px] px-[8px] py-[4px] rounded-lg ${edit ? 'cursor-pointer' : ''} relative`}
                onClick={() => {
                    if (edit) {
                        setOpenTimeTaskEndBox((prev) => !prev);
                    }
                }}
            >
                <span className={`${checkTimeExprire(timeTaskEnd.time, timeTaskEnd.date) ? 'text-red-500' : ''}`}>
                    <span className="mr-[4px]">
                        {checkTimeExprire(timeTaskEnd.time, timeTaskEnd.date) ? 'Đã hết hạn: ' : 'Đến hạn: '}
                    </span>
                    <span>{timeTaskEnd.time}, </span>
                    <span>{timeTaskEnd.date}</span>
                </span>
            </motion.div>

            {openTimeTaskEndBox && edit && (
                <div className="absolute top-[130%] shadow-custom-1 rounded-lg z-[50] right-0 beofore:content-[''] before:w-[30px] before:border-x-[18px] before:border-y-[20px] before:border-x-transparent before:border-t-transparent before:border-b-white before:block before:absolute before:top-[-30px] before:left-[50%] before:translate-x-[-50%]">
                    <TimeSetterBox
                        label="Hết hạn lúc"
                        handleCloseBox={() => {
                            setOpenTimeTaskEndBox(false);
                        }}
                        onChange={setTimeTaskEnd}
                        setError={setError}
                        date={timeTaskEnd.date}
                        time={timeTaskEnd.time}
                    />
                </div>
            )}
        </div>
    );
}
