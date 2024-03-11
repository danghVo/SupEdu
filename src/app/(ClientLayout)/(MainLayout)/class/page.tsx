'use client';

import image from '~/assets/image';
import ClassItem from './components/classItem';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import InputOption from '~/components/Input/InputOption';
import Selection from '~/components/Selection';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { userAgent } from 'next/server';
import { ClassController } from '~/controller/class.controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import CreateClassModal from './components/createClassModal';
import { open } from 'fs';
import JoinModal from './components/joinModal';

export interface coordinateItem {
    id: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface dragMode {
    enable: boolean;
    target: HTMLDivElement | null;
    distance: { [key: number]: { from: { x: number; y: number }; to: { x: number; y: number } } };
    coordinateItems: Array<coordinateItem | null>;
}

const classOfUserRaw = [
    {
        id: 0,
        name: 'Lớp A',
        teacher: {
            name: 'Man A',
            avartar: image.teacher,
        },
        description: 'Class Of A',
        background: 'from-[#0c7076] to-[#9d0020]',
        isLive: true,
        exercises: [
            {
                name: 'Task A',
                isDone: true,
            },
            {
                name: 'Task B',
                isDone: false,
            },
            {
                name: 'Task B',
                isDone: false,
            },
        ],
    },
    {
        id: 1,
        name: 'Lớp B',
        teacher: {
            name: 'Man B',
            avartar: image.teacher,
        },
        description: 'Class Of B',
        background: 'from-[#0c7076] to-[#9d0020]',
        isLive: false,
        exercises: [
            {
                name: 'Task A',
                isDone: false,
            },
            {
                name: 'Task B',
                isDone: false,
            },
        ],
    },
    {
        id: 2,
        name: 'Lớp C',
        teacher: {
            name: 'Man C',
            avartar: image.teacher,
        },
        description: 'Class Of C',
        background: 'from-[#0c7076] to-[#9d0020]',
        isLive: false,
        exercises: [
            {
                name: 'Task A',
                isDone: false,
            },
            {
                name: 'Task B',
                isDone: false,
            },
        ],
    },
];

const filter = [{ name: 'Trạng thái', choice: ['Đang hoạt động', 'Tất cả', 'Lớp học cũ'] }];

export default function Page() {
    const [classOfUser, setClassOfUser] = useState(classOfUserRaw);
    const [dragMode, setDragMode] = useState<dragMode>({
        enable: false,
        target: null,
        distance: classOfUser.reduce(
            (accu, curr) => Object.assign(accu, { [curr.id]: { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } } }),
            {},
        ),
        coordinateItems: [],
    });
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openJoinModal, setOpenJoinModal] = useState(false);

    const constraintsRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (!dragMode.enable && dragMode.coordinateItems.length > 0) {
            let newClassOfUser = dragMode.coordinateItems.reduce((accu: Array<any>, curr) => {
                const item = classOfUser.find((item) => item.id === curr!.id);
                if (item) {
                    return [...accu, item];
                } else return accu;
            }, []);

            setClassOfUser(newClassOfUser);
            setDragMode((prev) => ({
                ...prev,
                coordinateItems: [],
            }));
        }
    }, [dragMode.enable]);

    useEffect(() => {
        if (dragMode.coordinateItems.length === 0) {
            setDragMode((prev) => ({
                ...prev,
                coordinateItems: Array.from(document.querySelectorAll('div[data-drag]')).map((element) => {
                    const { top, left } = element.getBoundingClientRect();

                    return {
                        id: Number.parseInt(element.getAttribute('data-drag')!),
                        startX: left,
                        endX: left + element.clientWidth,
                        startY: top,
                        endY: top + element.clientHeight,
                    };
                }),
            }));
        }
    }, [dragMode.coordinateItems]);

    const fetchClasses = async () => {
        const classController = new ClassController();

        const data = await queryClient.fetchQuery({
            queryKey: ['classes'],

            queryFn: () => classController.getClasses(),
        });

        queryClient.setQueryData(['classes'], data);
    };

    return (
        <div className="px-[24px] py-[32px] min-h-full mx-[12px]">
            <div className="font-bold text-[32px] mb-[32px]">Các lớp học của bạn</div>

            <div className="mb-[64px] flex items-center gap-[16px]">
                {filter.map((item, index) => (
                    <div
                        key={index}
                        className={` font-semibold text-[18px] ${
                            item ? 'bg-[var(--text-color)] rounded-[25px]' : 'opacity-[0.6]'
                        }`}
                    >
                        <Selection
                            className="text-white"
                            label="Lớp học"
                            key={index}
                            defaultSelection={item.choice[0]}
                            onChange={() => {}}
                            optionData={item.choice}
                        />
                    </div>
                ))}
                <Button
                    handleClick={() => {
                        setOpenCreateModal(true);
                    }}
                    className="min-w-[150px] w-[200px]"
                >
                    <FontAwesomeIcon className="mr-[12px]" icon={faPlus} />
                    Tạo lớp mới
                </Button>
                <Button
                    handleClick={() => {
                        setOpenJoinModal(true);
                    }}
                    className="min-w-[150px] w-[200px]"
                >
                    <FontAwesomeIcon className="mr-[12px]" icon={faRightToBracket} />
                    Tham gia lớp
                </Button>
            </div>
            <div
                className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-x-[32px] gap-y-[64px] justify-center"
                ref={constraintsRef}
            >
                {classOfUser.map((item, index) => (
                    <div key={index} data-drag={item.id}>
                        <ClassItem
                            constraintDrag={constraintsRef}
                            dragMode={dragMode}
                            handleSetDragMode={setDragMode}
                            classItem={item}
                        />
                    </div>
                ))}
            </div>

            {openCreateModal && (
                <CreateClassModal
                    handleCloseModal={() => {
                        setOpenCreateModal(false);
                    }}
                />
            )}

            {openJoinModal && (
                <JoinModal
                    handleCloseModal={() => {
                        setOpenJoinModal(false);
                    }}
                />
            )}
        </div>
    );
}
