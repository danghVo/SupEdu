import { SyntheticEvent, use, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Calendar from '~/components/Calendar';
import { TimeData, hour, minute } from '~/constant';
import { AnimatePresence, PanInfo, motion } from 'framer-motion';
import './TimeSetterBox.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import TimePicker from '~/components/TimePicker';

interface SetTimeModalProps {
    label: string;
    date: string;
    time: string;
    onChange: ({ date, time }: TimeData) => void;
    handleCloseBox: () => void;
}

export default function TimeSetterBox({ label, date, time, onChange, handleCloseBox }: SetTimeModalProps) {
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
            setTimeSetterData((prev) => ({
                ...prev,
                date,
            }));
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
        setTimeSetterData((prev) => ({
            ...prev,
            time: `${time}:${prev.time.split(':')[1]}`,
        }));
    };

    const handleChooseMinute = (time: number) => {
        setTimeSetterData((prev) => ({
            ...prev,
            time: `${prev.time.split(':')[0]}:${time}`,
        }));
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
                Xong
            </Button>
        </div>
    );
}
