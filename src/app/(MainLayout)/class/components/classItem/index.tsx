import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle, faEllipsisV, faRightFromBracket, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { Dispatch, MutableRefObject, ReactEventHandler, SetStateAction, useMemo, useRef, useState } from 'react';
import { AnimatePresence, PanInfo, motion, useDragControls } from 'framer-motion';

import SimpleBarReact from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { coordinateItem, dragMode } from '../../page';

export interface classItem {
    id: number;
    name: string;
    teacher: {
        name: string;
        avartar: StaticImport;
    };
    description: string;
    background: {
        from: string;
        to: string;
    };
    isLive: boolean;
    exercises: Array<{ name: string; isDone: boolean }>;
}

export default function ClassItem({
    classItem,
    constraintDrag,
    dragMode,
    handleSetDragMode,
}: {
    classItem: classItem;
    constraintDrag: MutableRefObject<any>;
    dragMode: dragMode;
    handleSetDragMode: Dispatch<SetStateAction<dragMode>>;
}) {
    const [showDetailTask, setShowDetailTask] = useState(false);
    const [dragAble, setDragAble] = useState(false);

    const dragTargetRef = useRef<HTMLDivElement>(null);

    const progress = useMemo(
        () =>
            Math.floor(
                (classItem.exercises.filter((excercise) => excercise.isDone).length / classItem.exercises.length) *
                    10000,
            ) / 100,
        [classItem.exercises],
    );

    const handleStartDrag = () => {
        handleSetDragMode({
            ...dragMode,
            enable: true,
            target: dragTargetRef.current,
        });

        setDragAble(true);
    };

    const handleDrag = (event: MouseEvent, info: PanInfo) => {
        if (dragMode.coordinateItems.length > 0 && dragTargetRef.current) {
            const width = dragTargetRef.current.clientWidth;
            const height = dragTargetRef.current.clientHeight;
            let { left, top } = dragTargetRef.current.getBoundingClientRect();
            const currentCoordinate = dragMode.coordinateItems.find((item) => item!.id === classItem.id);

            if (currentCoordinate) {
                const centerPoint = {
                    x: left + width / 2,
                    y: top + height / 2,
                };

                const dropTarget = dragMode.coordinateItems.find(
                    (item) =>
                        item &&
                        item.startX <= centerPoint.x &&
                        item.endX >= centerPoint.x &&
                        item.startY <= centerPoint.y &&
                        item.endY >= centerPoint.y &&
                        classItem.id != item.id,
                );

                if (dropTarget) {
                    const moveDistance = {
                        x: currentCoordinate.startX - dropTarget.startX,
                        y: currentCoordinate.startY - dropTarget.startY,
                    };

                    const coordinateItems = dragMode.coordinateItems.map((item) => {
                        if (item) {
                            return {
                                ...item,
                                id:
                                    dropTarget.id === item.id
                                        ? classItem.id
                                        : item.id === classItem.id
                                          ? dropTarget.id
                                          : item.id,
                            };
                        } else return item;
                    });

                    handleSetDragMode((prev) => ({
                        ...prev,
                        coordinateItems,
                        distance: {
                            ...prev.distance,
                            [dropTarget.id]: {
                                from: prev.distance[dropTarget.id].to,
                                to: {
                                    x: prev.distance[dropTarget.id].to.x + moveDistance.x,
                                    y: prev.distance[dropTarget.id].to.y + moveDistance.y,
                                },
                            },
                        },
                    }));
                }
            }
        }
    };

    const handleEndDrag = (event: MouseEvent, info: PanInfo) => {
        const currentCoordinate = dragMode.coordinateItems.find((item) => item!.id === classItem.id);

        if (currentCoordinate && dragTargetRef.current) {
            const { left, top } = dragTargetRef.current.getBoundingClientRect();

            const distance = dragMode.coordinateItems.reduce((accu, curr) => {
                let item = { [curr!.id]: { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } } };
                if (classItem.id === curr!.id) {
                    item = {
                        [classItem.id]: {
                            from: {
                                x: left - currentCoordinate.startX,
                                y: top - currentCoordinate.startY,
                            },
                            to: { x: 0, y: 0 },
                        },
                    };
                }

                return Object.assign(accu, item);
            }, {});

            handleSetDragMode({
                ...dragMode,
                enable: false,
                target: null,
                distance,
            });
        }

        setDragAble(false);
    };

    return (
        <motion.div
            key={classItem.id}
            drag={dragAble}
            dragConstraints={constraintDrag}
            dragMomentum={false}
            dragSnapToOrigin={dragAble}
            ref={dragTargetRef}
            onDrag={handleDrag}
            onDragEnd={handleEndDrag}
            initial={dragMode.distance[classItem.id].from}
            animate={dragMode.distance[classItem.id].to}
            className={`w-full h-fit shadow-custom-2 bg-main rounded-[25px] relative ${
                dragAble ? 'cursor-move z-20 border-black border-solid border-[2px]' : 'cursor-pointer z-10'
            } hover:translate-y-[4px]`}
        >
            <div className={`bg-main h-[100px] text-white relative rounded-t-[25px]`}>
                {classItem.isLive && (
                    <div className="absolute text-white bg-[rgba(204,0,0,0.9)] w-[45px] h-[45px] rounded-full top-[8px] right-[8px] z-10 font-bold flex items-center justify-center">
                        Live
                    </div>
                )}
                <div
                    className={`absolute top-0 h-full flex items-center w-full bg-gradient-to-r ${classItem.background.from} ${classItem.background.to} rounded-t-[25px] overflow-hidden`}
                ></div>
                <div className="w-full h-full flex flex-col items-center px-[12px] justify-center translate-y-[-18px]">
                    <Image
                        src={classItem.teacher.avartar}
                        alt="teacher avatar"
                        className="w-[70px] h-[70px] bg-white rounded-full p-2 border-4 border-white border-solid mb-[4px]"
                    />
                    <div className="text-[20px] font-bold">{classItem.name}</div>
                    <div className="text-[16px]">{classItem.teacher.name}</div>
                </div>
            </div>
            <div className="bg-white">
                <div
                    onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        setShowDetailTask((prev) => !prev);
                    }}
                    className="h-fit px-[12px] py-[12px]"
                >
                    <div className="flex items-center justify-between mb-[4px] font-semibold">
                        <div>Bài tập</div>
                        <div>{progress}%</div>
                    </div>
                    <div className="h-[8px] w-full bg-slate-300 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-[var(--success)] rounded-full`}
                            style={{ width: progress + '%' }}
                        ></div>
                    </div>
                </div>
                <AnimatePresence>
                    {showDetailTask && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'fit-content' }}
                            exit={{ height: 0 }}
                            transition={{ type: 'smooth' }}
                            className="bg-white px-[12px] overflow-hidden"
                        >
                            <SimpleBarReact
                                style={{ maxHeight: '100px', padding: '0 12px 0 8px', margin: '12px 0' }}
                                classNames={{ track: 'simplebar-track' }}
                                forceVisible="y"
                            >
                                <div className="flex flex-col gap-[20px]">
                                    {classItem.exercises.map((exercise, subIndex) => (
                                        <div key={subIndex} className="flex items-center justify-between">
                                            <div>{exercise.name}</div>
                                            <div
                                                className={`${
                                                    exercise.isDone ? 'text-[var(--success)]' : ''
                                                } text-[18px]`}
                                            >
                                                <FontAwesomeIcon icon={exercise.isDone ? faCheckCircle : faCircle} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SimpleBarReact>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="h-[48px] bg-white border-t-2 border-solid border-slate-200 rounded-b-[25px] text-[20px]">
                <div className="mr-[20px] flex gap-[6px] items-center justify-end h-full">
                    <div className="w-[full] h-[full] rounded-full hover:bg-slate-400/30 cursor-pointer p-1 flex justify-center items-center">
                        <FontAwesomeIcon icon={faUpDownLeftRight} className="p-2" onClick={handleStartDrag} />
                    </div>
                    <div className="w-[full] h-[full] rounded-full hover:bg-slate-400/30 cursor-pointer p-1 flex justify-center items-center">
                        <FontAwesomeIcon icon={faRightFromBracket} className="p-2" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
