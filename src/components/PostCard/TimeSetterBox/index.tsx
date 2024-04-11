import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { TimeData, hour, minute } from '~/constant';
import Button from '~/components/Button';
import TimePicker from '~/components/TimePicker';
import './TimeSetterBox.scss';
import Calendar from '~/components/Calendar';

interface SetTimeModalProps {
    label: string;
    date: string;
    time: string;
    onChange: ({ date, time }: TimeData) => void;
    handleCloseBox: () => void;
    setError?: (error: string) => void;
}

export default function TimeSetterBox({
    label,
    date,
    time,
    onChange,
    handleCloseBox,
    setError = () => {},
}: SetTimeModalProps) {
    const [timeSetterData, setTimeSetterData] = useState({
        date: date,
        time: time,
    });
    const [openCalendar, setOpenCalendar] = useState(false);
    const [openNumberPicker, setOpenNumberPicker] = useState(false);
    const [currentSelection, setCurrentSelection] = useState(-1);
    const [positionPicker, setPositionPicker] = useState<{ left: string } | null>(null);

    const rootDivRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        if (rootDivRef.current) {
            const rootDivRect = rootDivRef.current.getBoundingClientRect();

            if (openCalendar) {
                if (300 > window.screen.width - rootDivRect.right - 300) {
                    setPositionPicker({
                        left: `-${324 + 32}px`,
                    });
                } else
                    setPositionPicker({
                        left: `${rootDivRect.width + 32}px`,
                    });
            } else if (openNumberPicker) {
                if (150 > window.screen.width - rootDivRect.right - 300) {
                    setPositionPicker({
                        left: `-${150 + 32}px`,
                    });
                } else
                    setPositionPicker({
                        left: `${rootDivRect.width + 32}px`,
                    });
            }
        }
    }, [openCalendar, openNumberPicker]);

    const handleChooseDay = (date: string | null) => {
        if (date) {
            const currentDate = new Date(Date.now()).getDate();
            const currentMotnh = new Date(Date.now()).getMonth() + 1;
            const currentYear = new Date(Date.now()).getFullYear();

            if (
                currentYear < parseInt(date.split('/')[2]) ||
                currentMotnh < parseInt(date.split('/')[1]) ||
                currentDate <= parseInt(date.split('/')[0])
            ) {
                setTimeSetterData((prev) => ({
                    ...prev,
                    date: `${date.split('/')[0]}/${date.split('/')[1]}/${date.split('/')[2]}`,
                }));
                setError('');
            } else {
                setError('Không thể đặt thời gian trong quá khứ');
            }
        }
    };

    const handleClose = () => {
        setCurrentSelection(-1);
        setOpenCalendar(false);
        setOpenNumberPicker(false);
        handleCloseBox();
    };

    const handleSubmit = () => {
        handleClose();
        onChange(timeSetterData);
    };

    const handleOpenCalendarPicker = () => {
        setOpenCalendar((prev) => !prev);
        setOpenNumberPicker(false);
        if (currentSelection !== 0) {
            setCurrentSelection(0);
        } else setCurrentSelection(-1);
    };

    const handleOpenNumberPicker = () => {
        setOpenNumberPicker((prev) => !prev);
        setOpenCalendar(false);
        if (currentSelection !== 1) {
            setCurrentSelection(1);
        } else setCurrentSelection(-1);
    };

    const handleChooseHour = (time: number) => {
        const now = new Date(Date.now());
        const currentDate = now.getDate();
        const currentHour = now.getHours();

        if (currentDate === parseInt(timeSetterData.date) && currentHour > time) {
            setError('Không thể đặt thời gian trong quá khứ');
        } else {
            setError('');
            setTimeSetterData((prev) => ({
                ...prev,
                time: `${time}:${prev.time.split(':')[1]}`,
            }));
        }
    };

    const handleChooseMinute = (time: number) => {
        const now = new Date(Date.now());
        const currentDate = now.getDate();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        if (
            currentDate === parseInt(timeSetterData.date) &&
            currentHour === parseInt(timeSetterData.time.split(':')[0]) &&
            currentMinute > time
        ) {
            setError('Không thể đặt thời gian trong quá khứ');
        } else {
            setError('');
            setTimeSetterData((prev) => ({
                ...prev,
                time: `${prev.time.split(':')[0]}:${time}`,
            }));
        }
    };

    return (
        <div
            ref={rootDivRef}
            className="h-fit bg-white min-w-[200px] rounded-lg relative flex flex-col items-center justify-center px-[12px] py-[12px]"
        >
            <div className="font-bold text-[24px]">{label}</div>
            <div
                className={`w-full flex items-center justify-center text-[18px] py-[8px] px-[12px] rounded-lg my-[12px] ${currentSelection === 0 ? 'border-2 border-blue-400 bg-blue-100/50' : 'shadow-custom-4'}`}
            >
                <span className="">Ngày:</span>
                <div className="pl-[12px] cursor-pointer grow">
                    <div className="font-semibold" onClick={handleOpenCalendarPicker}>
                        {timeSetterData.date}
                    </div>
                </div>
                <AnimatePresence>
                    {openCalendar && (
                        <motion.div
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={positionPicker ? { top: 0, left: positionPicker.left } : {}}
                            className={`${positionPicker ? `` : 'opacity-[0]'} shadow-custom-1 px-[12px] bg-white rounded-lg absolute`}
                        >
                            <div className="my-[-8px] text-[16px] w-[300px]">
                                <Calendar value={timeSetterData.date} handleClickDay={handleChooseDay} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div
                className={`flex items-center justify-center w-[100%] text-[18px] py-[8px] px-[12px] rounded-lg my-[12px] ${currentSelection === 1 ? 'border-2 border-blue-400 bg-blue-100/50' : 'shadow-custom-4'}`}
            >
                <span className="">Thời gian:</span>
                <div className="pl-[8px] cursor-pointer grow">
                    <div className="font-semibold" onClick={handleOpenNumberPicker}>
                        {timeSetterData.time}
                    </div>
                    <AnimatePresence>
                        {openNumberPicker && (
                            <motion.div
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={positionPicker ? { left: positionPicker.left } : {}}
                                className="w-[150px] top-0 h-full rounded-lg absolute flex items-center gap-[16px]"
                            >
                                <TimePicker
                                    timeData={hour}
                                    time={parseInt(timeSetterData.time.split(':')[0])}
                                    onChange={handleChooseHour}
                                />
                                <span className="font-bold text-[18px]">:</span>
                                <TimePicker
                                    timeData={minute}
                                    time={parseInt(timeSetterData.time.split(':')[1])}
                                    onChange={handleChooseMinute}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <Button handleClick={handleSubmit} className="w-full my-[4px] rounded-lg ">
                Đặt
            </Button>
        </div>
    );
}
