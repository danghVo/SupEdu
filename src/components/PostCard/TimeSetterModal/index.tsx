import { SyntheticEvent, use, useEffect, useMemo, useRef, useState } from 'react';
import Calendar from '~/components/Calendar';
import Modal from '~/components/Modal';
import { TimeData, hour } from '~/constant';
import { AnimatePresence, PanInfo, motion } from 'framer-motion';
import './TimeSetterModal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';

interface SetTimeModalProps {
    date?: string;
    time?: number;
    isOpen: boolean;
    handleCloseModal: () => void;
    onChange: ({ date, time }: TimeData) => void;
}

const currentDay = new Date();

export default function SetTimeModal({ date, time, onChange, handleCloseModal, isOpen }: SetTimeModalProps) {
    const [timeSetterData, setTimeSetterData] = useState({
        date: date || `${currentDay.getDate()}/${currentDay.getMonth() + 1}/${currentDay.getFullYear()}`,
        time: time || currentDay.getHours() + 1,
    });
    const [openCalendar, setOpenCalendar] = useState(false);
    const [openTime, setOpenTime] = useState(false);
    const [currentSelection, setCurrentSelection] = useState(-1);
    const [numberDragInfo, setNumberDragInfo] = useState({
        heightDragContraint: 0,
        move: 0,
        prevNumberScrollTop: 0,
    });
    const [isDragNumberEnd, setIsDragNumberEnd] = useState(false);

    const wrapperNumberScrollRef = useRef<HTMLDivElement | null>(null);
    const numberScrollRef = useRef<HTMLDivElement | null>(null);
    const dragContrainsRef = useRef<HTMLDivElement | null>(null);
    const activeNumberRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (wrapperNumberScrollRef.current && openTime && numberScrollRef.current && activeNumberRef.current) {
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
    }, [openTime]);

    useEffect(() => {
        if (isDragNumberEnd && numberScrollRef.current && openTime) {
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
        if (numberScrollRef.current && openTime) {
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
        handleCloseModal();
        setCurrentSelection(-1);
        setOpenCalendar(false);
        setOpenTime(false);
    };

    const handleSubmit = () => {
        handleClose();
        onChange(timeSetterData);
    };

    return isOpen ? (
        <Modal handleCloseModal={handleClose} width={'fit-content'} height={'fit-content'}>
            <div className="relative flex flex-col items-center justify-center px-[12px] py-[12px] ">
                <div className="font-bold text-[24px]">Đặt giờ</div>
                <div
                    className={`flex items-center justify-center text-[18px] py-[8px] px-[12px] rounded-lg my-[12px] ${currentSelection === 0 ? 'border-2 border-blue-400 bg-blue-100/50' : 'shadow-custom-4'}`}
                >
                    <span className="">Ngày đăng:</span>
                    <div className="pl-[12px] cursor-pointer grow">
                        <div
                            className="text-center font-semibold"
                            onClick={() => {
                                setOpenCalendar((prev) => !prev);
                                setOpenTime(false);
                                setCurrentSelection(0);
                            }}
                        >
                            {timeSetterData.date}
                        </div>
                        <AnimatePresence>
                            {openCalendar && (
                                <motion.div
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="shadow-custom-1 px-[12px] bg-white rounded-lg absolute top-0 left-[110%]"
                                >
                                    <div className="my-[-8px] text-[16px] w-[300px]">
                                        <Calendar handleClickDay={handleChooseDay} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div
                    className={`flex items-center justify-center w-[100%] text-[18px] py-[8px] px-[12px] rounded-lg my-[12px] ${currentSelection === 1 ? 'border-2 border-blue-400 bg-blue-100/50' : 'shadow-custom-4'}`}
                >
                    <span className="">Giờ đăng:</span>
                    <div className="pl-[8px] cursor-pointer grow">
                        <div
                            className="font-semibold"
                            onClick={() => {
                                setOpenTime((prev) => !prev);
                                setOpenCalendar(false);
                                setCurrentSelection(1);
                            }}
                        >
                            {timeSetterData.time}h
                        </div>
                        <AnimatePresence>
                            {openTime && (
                                <motion.div
                                    id="number-scroll-bar"
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    ref={wrapperNumberScrollRef}
                                    className="shadow-custom-1 w-[50px] h-full bg-white rounded-lg absolute top-0 left-[110%] overflow-hidden flex items-center justify-center"
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
                                                className={
                                                    timeSetterData.time === item ? 'font-semibold' : 'opacity-[0.6]'
                                                }
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
        </Modal>
    ) : null;
}
