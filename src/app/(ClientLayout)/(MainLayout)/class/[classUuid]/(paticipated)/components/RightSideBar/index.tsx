'use client';

import { faBook, faSquarePollHorizontal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SimpleBarReact from 'simplebar-react';
import Link from 'next/link';

import Calendar from '~/components/Calendar';
import Image from 'next/image';
import image from '~/assets/image';
import useProfile from '~/hooks/useProfile';
import { useCalendar } from '~/hooks';
import { PostController } from '~/controller';
import Loading from '~/components/Loading';

export default function RightSideBar({ classUuid }: { classUuid: string }) {
    const [taskInDateShow, setTaskInDateShow] = useState<{ date: string; tasks: Array<any> } | null>(null);
    const { data: markedDays, isSuccess: isMarkedDaysSuccess, isRefetching, isLoading } = useCalendar(classUuid);
    const { data: profile, isSuccess: isProfileSuccess } = useProfile();

    useEffect(() => {
        if (markedDays && taskInDateShow?.date) {
            handleClickDay(taskInDateShow.date);
        }
    }, [markedDays]);

    const handleGetTaskInDate = async (date: string) => {
        const postController = new PostController();

        const res = await postController.getTaskInDate(classUuid, date);

        if (!res.error) {
            setTaskInDateShow({ date, tasks: res });
        }
    };

    const handleClickDay = (date: string | null) => {
        if (date && isMarkedDaysSuccess && !markedDays.error) {
            const dateSelected = markedDays?.find((markedDay: string) => markedDay === date) || null;

            if (dateSelected) {
                handleGetTaskInDate(dateSelected);
            } else setTaskInDateShow({ date, tasks: [] });
        } else setTaskInDateShow(null);
    };

    return (
        isProfileSuccess && (
            <SimpleBarReact
                classNames={{ track: 'simplebar-track' }}
                forceVisible="y"
                style={{ height: '100vh' }}
                className="lg:w-[300px] sm:w-[200px]  bg-white pb-[32px]"
            >
                <div className="flex flex-col items-center justify-center mt-[18px] mb-[28px]">
                    <div className="mb-[8px] p-[4px]">
                        <Image
                            src={
                                profile.avatar !== null
                                    ? profile.avatar
                                    : profile.role === 'TEACHER'
                                      ? image.teacher
                                      : image.student
                            }
                            width={100}
                            height={100}
                            alt="avatar"
                            className="rounded-full bg-slate-200"
                        />
                    </div>
                    <div className="text-[20px] font-semibold">{profile.name}</div>
                    <div className="font-light text-slate-400 text-[14px]">{profile.email}</div>
                </div>

                {!isMarkedDaysSuccess ? (
                    <Loading className="text-[64px]" />
                ) : (
                    <Calendar handleClickDay={handleClickDay} markedDays={markedDays} />
                )}

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
                        {isRefetching || isLoading ? (
                            <Loading />
                        ) : (
                            <SimpleBarReact
                                classNames={{ track: 'simplebar-track' }}
                                forceVisible="y"
                                style={{ maxHeight: '250px' }}
                                className="w-full mt-[8px] h-full"
                            >
                                {taskInDateShow.tasks.length > 0 ? (
                                    <div className="w-full px-[8px]">
                                        {taskInDateShow.tasks.map((task, index) => (
                                            <Link
                                                href={`#${task.uuid}`}
                                                className="flex items-center my-[16px] cursor-pointer"
                                                key={index}
                                            >
                                                <div className="w-[40px] h-[40px] bg-slate-200 rounded-2xl flex items-center justify-center text-[20px]">
                                                    <FontAwesomeIcon
                                                        icon={
                                                            task.type === 'Exercise' ? faBook : faSquarePollHorizontal
                                                        }
                                                    />
                                                </div>
                                                <div className="ml-[12px]">
                                                    <div className="font-semibold text-[16px] truncate">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-[14px] font-light text-slate-400 truncate">
                                                        Hết hạn: {task.endInTime} {task.endInDate}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="font-bold  flex items-center justify-center my-[12px]">Trống</div>
                                )}
                            </SimpleBarReact>
                        )}
                    </motion.div>
                )}
            </SimpleBarReact>
        )
    );
}
