import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { isNull } from 'util';

export default function Slider({
    data,
    clickItem,
    itemUI,
    initItemIndex = 0,
}: {
    data: Array<any>;
    clickItem: (e: SyntheticEvent, item: any) => any;
    itemUI: (item: any) => React.ReactNode;
    initItemIndex?: number;
}) {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [animate, setAnimate] = useState({ from: 0, to: 0 });

    const wrapperItemRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setCurrentItemIndex(initItemIndex === -1 ? 0 : initItemIndex);
    }, [initItemIndex]);

    useEffect(() => {
        if (wrapperItemRef.current) {
            setAnimate((prev) => ({
                from: prev.to,
                to: wrapperItemRef.current!.clientWidth * currentItemIndex,
            }));
        }
    }, [currentItemIndex]);

    const handleChangeItem = (e: SyntheticEvent, nextIndex: number) => {
        e.preventDefault();
        if (nextIndex !== currentItemIndex) {
            setCurrentItemIndex(nextIndex);
            clickItem(e, data[nextIndex]);
        }
    };

    return (
        <div className="flex min-w-[100px] w-full px-[8px] col-span-2 items-center justify-center">
            <div
                onMouseDown={(e) => handleChangeItem(e, currentItemIndex > 0 ? currentItemIndex - 1 : currentItemIndex)}
                className={`cursor-pointer items-center flex px-[4px] py-[8px] ${currentItemIndex <= 0 ? 'opacity-50' : ''}`}
            >
                <FontAwesomeIcon icon={faCaretLeft} />
            </div>
            <div ref={wrapperItemRef} className="relative grow overflow-hidden h-full ">
                <motion.div
                    initial={{ x: animate.from }}
                    animate={{ x: -animate.to }}
                    className="flex absolute items-center justify-center h-full"
                >
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className={`px-[4px] text-[14px] flex justify-center items-center`}
                            style={{ width: wrapperItemRef.current?.clientWidth + 'px' }}
                        >
                            {itemUI(item)}
                        </div>
                    ))}
                </motion.div>
            </div>
            <div
                onMouseDown={(e) =>
                    handleChangeItem(e, currentItemIndex < data.length - 1 ? currentItemIndex + 1 : currentItemIndex)
                }
                className={`cursor-pointer items-center flex px-[4px] py-[8px] ${currentItemIndex >= data.length - 1 ? 'opacity-50' : ''}`}
            >
                <FontAwesomeIcon icon={faCaretRight} />
            </div>
        </div>
    );
}
