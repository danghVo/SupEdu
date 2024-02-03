import { SyntheticEvent, use, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Calendar from '~/components/Calendar';
import { TimeData, hour } from '~/constant';
import { AnimatePresence, PanInfo, motion } from 'framer-motion';
import './TimeSetterBox.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';

interface SetTimeModalProps {
    label: string;
    date: string;
    time: number;
    onChange: ({ date, time }: TimeData) => void;
    handleCloseBox: () => void;
}

const currentDay = new Date();

export default function TimeSetterBox({ label, date, time, onChange, handleCloseBox }: SetTimeModalProps) {
    const [timeSetterData, setTimeSetterData] = useState({
        date: date,
        time: time,
    });
    const [openCalendar, setOpenCalendar] = useState(false);
    const [openNumberPicker, setOpenNumberPicker] = useState(false);
    const [currentSelection, setCurrentSelection] = useState(-1);
    const [numberDragInfo, setNumberDragInfo] = useState({
        heightDragContraint: 0,
        move: 0,
        prevNumberScrollTop: 0,
    });
    const [isDragNumberEnd, setIsDragNumberEnd] = useState(false);
    const [positionPicker, setPositionPicker] = useState<{ left: string } | null>(null);

    const rootDivRef = useRef<HTMLDivElement | null>(null);
    const wrapperCalenderRef = useRef<HTMLDivElement | null>(null);
    const wrapperNumberScrollRef = useRef<HTMLDivElement | null>(null);
    const numberScrollRef = useRef<HTMLDivElement | null>(null);
    const activeNumberRef = useRef<HTMLDivElement | null>(null);
    const dragContrainsRef = useRef<HTMLDivElement | null>(null);

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
                if (50 > window.screen.width - rootDivRect.right - 300) {
                    setPositionPicker({
                        left: `-${50 + 32}px`,
                    });
                } else
                    setPositionPicker({
                        left: `${rootDivRect.width + 32}px`,
                    });
            }
        }
    }, [openCalendar, openNumberPicker]);

    useEffect(() => {
        if (wrapperNumberScrollRef.current && openNumberPicker && numberScrollRef.current && activeNumberRef.current) {
            const wrapperRect = wrapperNumberScrollRef.current.getBoundingClientRect();
            const numberScrollRect = numberScrollRef.current.getBoundingClientRect();
            const activeRect = activeNumberRef.current.getBoundingClientRect();

            const heightPerItem = numberScrollRect.height / 24;
            const gapFromWrapperToActive = activeRect.top - wrapperRect.top;

            const gapContrains = numberScrollRect.height - wrapperRect.height;

            const distanceToCurrentNumber = gapFromWrapperToActive - heightPerItem * timeSetterData.time;

            setNumberDragInfo((prev) => ({
                ...prev,
                heightDragContraint: gapContrains + numberScrollRect.height + gapFromWrapperToActive * 2,
                move: distanceToCurrentNumber,
                prevNumberScrollTop: numberScrollRect.top + distanceToCurrentNumber,
            }));
        }
    }, [openNumberPicker]);

    useEffect(() => {
        if (isDragNumberEnd && numberScrollRef.current && openNumberPicker) {
            const numberScrollRect = numberScrollRef.current.getBoundingClientRect();
            const heightPerItem = numberScrollRect.height / 24;
            let itemMove = (numberScrollRect.top - numberDragInfo.prevNumberScrollTop) / heightPerItem;

            if (itemMove % 1 >= 0.5) {
                itemMove = Math.ceil(itemMove);
            } else itemMove = Math.floor(itemMove);

            if (itemMove === 0) {
                if (numberScrollRect.top > numberDragInfo.prevNumberScrollTop) {
                    itemMove = 1;
                } else itemMove = -1;
            }

            if (timeSetterData.time - itemMove > 23) {
                itemMove = -(23 - timeSetterData.time);
            } else if (timeSetterData.time - itemMove < 0) {
                itemMove = timeSetterData.time;
            }

            const distanceToCurrentNumber = numberDragInfo.move + itemMove * heightPerItem;

            setTimeSetterData((prev) => ({
                ...prev,
                time: prev.time - itemMove,
            }));

            setNumberDragInfo((prev) => ({
                ...prev,
                move: distanceToCurrentNumber,
                prevNumberScrollTop: prev.prevNumberScrollTop + heightPerItem * itemMove,
            }));

            setIsDragNumberEnd(false);
        }
    }, [isDragNumberEnd]);

    const handleChooseDay = (date: string | null) => {
        if (date) {
            setTimeSetterData((prev) => ({
                ...prev,
                date,
            }));
        }
    };

    const hanleDragNumberEnd = (even: MouseEvent, info: PanInfo) => {
        setIsDragNumberEnd(true);
    };

    const handleMoveToNumber = (item: number) => {
        if (numberScrollRef.current && openNumberPicker) {
            const numberScrollRect = numberScrollRef.current.getBoundingClientRect();
            const heightPerItem = numberScrollRect.height / 24;
            const itemMove = item - timeSetterData.time;

            const distanceToCurrentNumber = numberDragInfo.move - itemMove * heightPerItem;

            setTimeSetterData((prev) => ({
                ...prev,
                time: item,
            }));

            setNumberDragInfo((prev) => ({
                ...prev,
                move: distanceToCurrentNumber,
                prevNumberScrollTop: prev.prevNumberScrollTop + heightPerItem * itemMove,
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
                            ref={wrapperCalenderRef}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={positionPicker ? { top: 0, left: positionPicker.left } : {}}
                            className={`${positionPicker ? `` : 'opacity-[0]'} shadow-custom-1 px-[12px] bg-white rounded-lg absolute`}
                        >
                            <div className="my-[-8px] text-[16px] w-[300px]">
                                <Calendar value={date} handleClickDay={handleChooseDay} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div
                className={`flex items-center justify-center w-[100%] text-[18px] py-[8px] px-[12px] rounded-lg my-[12px] ${currentSelection === 1 ? 'border-2 border-blue-400 bg-blue-100/50' : 'shadow-custom-4'}`}
            >
                <span className="">Giờ:</span>
                <div className="pl-[8px] cursor-pointer grow">
                    <div className="font-semibold" onClick={handleOpenNumberPicker}>
                        {timeSetterData.time}h
                    </div>
                    <AnimatePresence>
                        {openNumberPicker && (
                            <motion.div
                                id="number-scroll-bar"
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={positionPicker ? { top: 0, left: positionPicker.left } : {}}
                                ref={wrapperNumberScrollRef}
                                className="shadow-custom-1 w-[50px] h-full bg-white rounded-lg absolute overflow-hidden flex items-center justify-center"
                            >
                                <div
                                    style={{ height: numberDragInfo.heightDragContraint }}
                                    ref={dragContrainsRef}
                                    className="w-full"
                                ></div>
                                <div
                                    ref={activeNumberRef}
                                    className="flex items-center w-full h-[20px] justify-between px-[4px] bg-sky-100 absolute"
                                >
                                    <FontAwesomeIcon className="text-blue-400" icon={faCaretRight} />
                                    <FontAwesomeIcon className="text-blue-400" icon={faCaretLeft} />
                                </div>
                                <motion.div
                                    ref={numberScrollRef}
                                    drag="y"
                                    animate={{ y: numberDragInfo.move - 2 }}
                                    onDragEnd={hanleDragNumberEnd}
                                    dragMomentum={false}
                                    dragConstraints={dragContrainsRef}
                                    className="text-[16px] flex flex-col items-center justify-center absolute top-0 left-0 right-0"
                                >
                                    {hour.map((item) => (
                                        <div
                                            key={item}
                                            onClick={(e) => handleMoveToNumber(item)}
                                            className={timeSetterData.time === item ? 'font-semibold' : 'opacity-[0.6]'}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </motion.div>
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
