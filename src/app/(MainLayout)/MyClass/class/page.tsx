'use client';

import image from '~/assets/image';
import ClassItem from './components/ClassItem';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';

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
        background: {
            from: 'from-[#0c7076]',
            to: 'to-[#9d0020]',
        },
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
        background: {
            from: 'from-[#0c7076]',
            to: 'to-[#9d0020]',
        },
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
        background: {
            from: 'from-[#0c7076]',
            to: 'to-[#9d0020]',
        },
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
    const constraintsRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="mt-[64px]">
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
        </div>
    );
}
