import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PanInfo, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function TimePicker({
    timeData,
    time,
    onChange,
}: {
    timeData: Array<number>;
    time: number;
    onChange: (time: number) => void;
}) {
    const [currentTime, setCurrentTime] = useState(time);
    const [numberDragInfo, setNumberDragInfo] = useState({
        heightDragContraint: 0,
        move: 0,
        prevNumberScrollTop: 0,
    });
    const [isDragNumberEnd, setIsDragNumberEnd] = useState(false);

    const wrapperNumberScrollRef = useRef<HTMLDivElement | null>(null);
    const numberScrollRef = useRef<HTMLDivElement | null>(null);
    const activeNumberRef = useRef<HTMLDivElement | null>(null);
    const dragContrainsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (wrapperNumberScrollRef.current && numberScrollRef.current && activeNumberRef.current) {
            const wrapperRect = wrapperNumberScrollRef.current.getBoundingClientRect();
            const numberScrollRect = numberScrollRef.current.getBoundingClientRect();
            const activeRect = activeNumberRef.current.getBoundingClientRect();

            const heightPerItem = numberScrollRect.height / timeData.length;
            const gapFromWrapperToActive = activeRect.top - wrapperRect.top;

            const gapContrains = numberScrollRect.height - wrapperRect.height;

            const distanceToCurrentNumber = gapFromWrapperToActive - heightPerItem * currentTime;

            setNumberDragInfo((prev) => ({
                ...prev,
                heightDragContraint: gapContrains + numberScrollRect.height + gapFromWrapperToActive * 2,
                move: distanceToCurrentNumber,
                prevNumberScrollTop: numberScrollRect.top + distanceToCurrentNumber,
            }));
        }
    }, []);

    useEffect(() => {
        onChange(currentTime);
    }, [currentTime]);

    useEffect(() => {
        if (isDragNumberEnd && numberScrollRef.current) {
            const numberScrollRect = numberScrollRef.current.getBoundingClientRect();
            const heightPerItem = numberScrollRect.height / timeData.length;
            let distance = 0;

            if (numberScrollRect.top > 0 && numberDragInfo.prevNumberScrollTop < 0) {
                distance = numberScrollRect.top - numberDragInfo.prevNumberScrollTop;
            } else if (numberScrollRect.top < 0 && numberDragInfo.prevNumberScrollTop > 0) {
                distance = -(Math.abs(numberScrollRect.top) + numberDragInfo.prevNumberScrollTop);
            } else distance = numberScrollRect.top - numberDragInfo.prevNumberScrollTop;

            let itemMove = distance / heightPerItem;

            if (itemMove % 1 >= 0.5) {
                itemMove = Math.ceil(itemMove);
            } else itemMove = Math.floor(itemMove);

            if (itemMove === 0) {
                if (numberScrollRect.top > numberDragInfo.prevNumberScrollTop) {
                    itemMove = 1;
                } else itemMove = -1;
            }

            if (currentTime - itemMove > timeData[timeData.length - 1]) {
                itemMove = -(timeData[timeData.length - 1] - currentTime);
            } else if (currentTime - itemMove < 0) {
                itemMove = currentTime;
            }

            const distanceToCurrentNumber = numberDragInfo.move + itemMove * heightPerItem;

            setCurrentTime((prev) => prev - itemMove);

            setNumberDragInfo((prev) => ({
                ...prev,
                move: distanceToCurrentNumber,
                prevNumberScrollTop: prev.prevNumberScrollTop + heightPerItem * itemMove,
            }));

            setIsDragNumberEnd(false);
        }
    }, [isDragNumberEnd]);

    const hanleDragNumberEnd = (even: MouseEvent, info: PanInfo) => {
        setIsDragNumberEnd(true);
    };

    return (
        <motion.div
            ref={wrapperNumberScrollRef}
            className="w-[50px] h-full bg-white shadow-custom-2 rounded-lg relative overflow-hidden flex items-center justify-center"
        >
            <div style={{ height: numberDragInfo.heightDragContraint }} ref={dragContrainsRef} className="w-full"></div>
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
                {timeData.map((item) => (
                    <div
                        key={item}
                        className={`${currentTime === item ? 'font-semibold' : 'opacity-[0.6]'} w-full flex justify-center`}
                    >
                        {item}
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
}
