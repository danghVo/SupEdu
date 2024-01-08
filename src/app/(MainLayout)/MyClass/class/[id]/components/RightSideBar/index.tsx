'use client';

import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SimpleBarReact from 'simplebar-react';

import Calendar from '~/components/Calendar';
import Image from 'next/image';
import image from '~/assets/image';

const markedDays = [
    {
        date: '3/1/2024',
        tasks: [
            {
                name: 'Bài tập A',
                end: { date: '3/1/2024', time: 12 },
            },
        ],
    },
    { date: '4/1/2024', tasks: [] },
    { date: '31/1/2024', tasks: [] },
];

export default function RightSideBar() {
    const [taskInDateShow, setTaskInDateShow] = useState<{ date: string; tasks: Array<any> } | null>(null);

    const handleClickDay = (date: string | null) => {
        if (date) {
            const dateSelected = markedDays.find((markedDay) => markedDay.date === date);
            if (!dateSelected || dateSelected.tasks.length === 0) {
                setTaskInDateShow({ date, tasks: [] });
            } else setTaskInDateShow(dateSelected);
        } else setTaskInDateShow(null);
    };

    return (
        <SimpleBarReact
            classNames={{ track: 'simplebar-track' }}
            forceVisible="y"
            style={{ height: '100vh' }}
            className="w-[320px] bg-white pb-[32px]"
        >
            <div className="flex flex-col items-center justify-center mt-[18px] mb-[28px]">
                <div className="mb-[8px] p-[4px]">
                    <Image src={image.student} alt="avatar" className="w-[100px] h-[100px] rounded-full bg-slate-200" />
                </div>
                <div className="text-[20px] font-semibold">Student</div>
                <div className="font-light text-slate-400 text-[14px]">student@gmail.com</div>
            </div>

            <Calendar handleClickDay={handleClickDay} markedDays={markedDays.map((markedDay) => markedDay.date)} />

            {taskInDateShow && (
                <motion.div
                    initial={{ scaleY: 0, opacity: 1 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    key={taskInDateShow.date}
                    className="py-[8px] px-[8px] mt-[32px] shadow-custom-1 rounded-2xl mx-[12px] overflow-hidden"
                >
                    <div className="font-bold">
                        <div className="w-fit bg-[var(--text-color)] text-white px-[12px] py-[8px] rounded-2xl">
                            Ngày: {taskInDateShow.date}
                        </div>
                    </div>
                    <SimpleBarReact
                        classNames={{ track: 'simplebar-track' }}
                        forceVisible="y"
                        style={{ maxHeight: '250px' }}
                        className="w-full mt-[8px] h-full"
                    >
                        {taskInDateShow.tasks.length > 0 ? (
                            <div className="w-full px-[8px]">
                                {taskInDateShow.tasks.map((task, index) => (
                                    <div className="flex items-center my-[8px]" key={index}>
                                        <div className="w-[40px] h-[40px] bg-slate-200 rounded-2xl flex items-center justify-center text-[20px]">
                                            <FontAwesomeIcon icon={faBook} />
                                        </div>
                                        <div className="ml-[12px]">
                                            <div className="font-semibold text-[16px] truncate">{task.name}</div>
                                            <div className="text-[14px] font-light text-slate-400 truncate">
                                                Hết hạn: {task.end.time} giờ
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="font-bold  flex items-center justify-center my-[12px]">Trống</div>
                        )}
                    </SimpleBarReact>
                </motion.div>
            )}
        </SimpleBarReact>
    );
}
