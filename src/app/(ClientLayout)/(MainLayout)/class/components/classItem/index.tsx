import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { AnimatePresence, PanInfo, motion, useDragControls } from 'framer-motion';

import SimpleBarReact from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import images from '~/assets/image';
// import { coordinateItem, dragMode } from '../../page';

export interface classItem {
    id: number;
    name: string;
    owner: {
        name: string;
        avatar: string;
    };
    description: string;
    background: string | null;
    theme: string;
    exercises: Array<{ name: string; isDone: boolean }>;
}

export default function ClassItem({ classItem }: { classItem: classItem }) {
    const [showDetailTask, setShowDetailTask] = useState(false);
    const progress = useMemo(
        () =>
            classItem.exercises?.length > 0
                ? Math.floor(
                      (classItem.exercises.filter((excercise) => excercise.isDone).length /
                          classItem.exercises.length) *
                          10000,
                  ) / 100
                : 0,
        [classItem.exercises],
    );

    return (
        <motion.div
            key={classItem.id}
            className={`w-full h-fit shadow-custom-2 bg-main rounded-[25px] relativehover:translate-y-[4px]`}
        >
            <div className={`bg-main h-[100px] text-white relative rounded-t-[25px]`}>
                {classItem.background ? (
                    <></>
                ) : (
                    // <Image
                    //     src={classItem.background}
                    //     alt="class background"
                    //     width={387}
                    //     height={100}
                    //     className="absolute w-full h-[100px] object-cover rounded-t-[25px]"
                    // />
                    <div
                        className={`absolute top-0 h-full flex items-center w-full bg-gradient-to-r from-[#000] to-[#000] ${classItem.theme} rounded-t-[25px] overflow-hidden`}
                        // style={{ backgroundImage: `linear-gradient(to right, )` }}
                    ></div>
                )}

                <div className="w-full h-full flex flex-col items-center px-[12px] justify-center translate-y-[-18px] contrast-100">
                    <Image
                        src={classItem.owner.avatar || images.teacher}
                        alt="teacher avatar"
                        className="w-[70px] h-[70px] bg-white rounded-full p-2 border-4 border-white border-solid mb-[4px]"
                    />
                    <div className="text-[20px] font-bold">{classItem.name}</div>
                    <div className="text-[16px]">{classItem.owner.name}</div>
                </div>
            </div>

            {classItem.exercises?.length > 0 && (
                <div
                    className="bg-white"
                    onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        setShowDetailTask((prev) => !prev);
                    }}
                >
                    <div className="h-fit px-[12px] py-[12px]">
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
                                                    <FontAwesomeIcon
                                                        icon={exercise.isDone ? faCheckCircle : faCircle}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </SimpleBarReact>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <div className="h-[32px] bg-white border-t-2 border-solid border-slate-200 rounded-b-[25px] text-[20px]"></div>
        </motion.div>
    );
}
