'use client';

import { motion } from 'framer-motion';
import React, { createContext, MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import { classDetailSections } from '~/constant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faPen } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

import useClass from '~/hooks/useClass';
import { NotificationTheme } from '~/app/(ClientLayout)/(MainLayout)/layout';
import { NotificationType } from '~/components/Notification';
import SimpleBarReact from 'simplebar-react';
import EditClassModal, { FormData } from '../../../../components/editClassModal';
import Loading from '~/components/Loading';
import ConfirmModal from '~/components/Modal/ConfirmModal';
import Button from '~/components/Button';
import { ClassController } from '~/controller';

export const ScrollTheme = createContext<() => void>(() => {});

export default function Main({ classUuid, children }: { classUuid: string; children: React.ReactNode }) {
    const pathName = usePathname();
    const [currentSection, setCurrentSection] = useState(
        classDetailSections.find((classDetailSection) => classDetailSection.path === pathName.split('/')[3]) ||
            classDetailSections[0],
    );
    const [sectionAnimation, setSectionAnimation] = useState({ x: 0 });
    const { data: classData, isSuccess: isClassSuccess, refetch } = useClass(classUuid);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();
    const notificationShow = useContext(NotificationTheme);

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<any>(null);

    useEffect(() => {
        const pathSection = pathName.split('/')[3];
        const currentClassSection = classDetailSections.find(
            (classDetailSection) => classDetailSection.path === pathSection,
        );

        if (currentClassSection) {
            setCurrentSection(currentClassSection);
        }
    }, [pathName]);

    const handleChangeSection = (event: MouseEvent, section: string) => {
        if (wrapperRef.current) {
            const prevAnimationElement = wrapperRef.current.querySelector('#section-animation');
            if (prevAnimationElement) {
                const prevX = prevAnimationElement.getBoundingClientRect().left;
                const targetElement = event.target as HTMLDivElement;

                setCurrentSection(
                    classDetailSections.find((classDetailSeciton) => classDetailSeciton.name === section)!,
                );
                setSectionAnimation({ x: prevX - targetElement.getBoundingClientRect().left });
            }
        }
    };

    const handleUpdateClass = async (formData: FormData) => {
        // submit change class name
        const classController = new ClassController();

        const res = await queryClient.fetchQuery({
            queryKey: ['update', classUuid],
            queryFn: () => classController.updateClass(classUuid, formData),
        });

        if (!res.error) {
            refetch();
            setOpenEditModal(false);
            notificationShow('Cập nhật thành công', NotificationType.success);
        } else {
            notificationShow(res.error, NotificationType.error);
        }
    };

    const handleLeaveClass = async () => {
        const classController = new ClassController();

        const res = await classController.leaveClass(classUuid);

        if (!res.error) {
            router.push('/class');
            queryClient.removeQueries({ queryKey: ['class', classUuid] });
            notificationShow('Rời lớp thành công', NotificationType.success);
        } else notificationShow('Rời lớp thất bại', NotificationType.error);
    };

    const handleDeleteClass = async () => {
        const classController = new ClassController();

        const res = await classController.deleteClass(classUuid);

        if (!res.error) {
            queryClient.removeQueries({ queryKey: ['class', classUuid] });
            router.push('/class');
            notificationShow('Xóa lớp thành công', NotificationType.success);
        }
    };

    const handleScrollTop = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    };

    return isClassSuccess ? (
        <>
            <div
                className="h-screen flex-col flex p-[32px] pt-[32px] grow"
                ref={wrapperRef}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${classData.theme.from}, ${classData.theme.to})`,
                }}
            >
                <div style={{ color: classData.textColor }}>
                    <div className="flex justify-between items-center mb-[28px]">
                        <div className="font-bold flex items-center justify-between text-[32px]">
                            <div
                                onClick={() => {
                                    router.push('/class');
                                    queryClient.removeQueries({ queryKey: ['class', classUuid] });
                                }}
                                className="cursor-pointer mr-[12px]"
                            >
                                <FontAwesomeIcon icon={faCaretLeft} />
                            </div>
                            <div>{classData.name}</div>
                            {classData.isOwner && (
                                <div
                                    onClick={() => setOpenEditModal(true)}
                                    className="text-[24px] ml-[16px] cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faPen} />
                                </div>
                            )}
                        </div>
                        <div className="mr-[64px]">
                            <Button
                                className="rounded-lg bg-red-700 text-white w-[100px] shadow-custom-1"
                                theme=""
                                handleClick={() => setOpenConfirmModal(true)}
                            >
                                {classData.isOwner ? 'Xóa' : 'Thoát'}
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-[32px] mb-[12px] ml-[8px]">
                        {classDetailSections.map((section, index) => (
                            <Link
                                key={index}
                                href={`/class/${classUuid}/` + section.path}
                                onClick={(event) => handleChangeSection(event, section.name)}
                                className={`text-[18px] font-semibold cursor-pointer px-[12px] py-[8px] relative ${
                                    section.name === currentSection.name ? 'text-white' : ''
                                }`}
                            >
                                {currentSection.name === section.name && (
                                    <motion.div
                                        id="section-animation"
                                        initial={sectionAnimation}
                                        animate={{ x: 0 }}
                                        className="bg-[var(--text-color)] absolute top-0 left-0 h-full w-full rounded-full"
                                    ></motion.div>
                                )}
                                <span className="relative z-20">{section.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <SimpleBarReact
                    scrollableNodeProps={{ ref: scrollRef }}
                    style={{
                        height: 'calc(100vh - 192px)',
                    }}
                    classNames={{ track: 'mr-2 bg-transparent', visible: 'invisible' }}
                    forceVisible="y"
                    className="grow mt-[28px]"
                >
                    <ScrollTheme.Provider value={handleScrollTop}>{children}</ScrollTheme.Provider>
                </SimpleBarReact>
            </div>

            {openConfirmModal && (
                <ConfirmModal
                    title={
                        !classData.isOwner
                            ? 'Bạn có chắc chắn muốn rời lớp không ?'
                            : 'Bạn có chắn chắn muốn xóa lớp này không ?'
                    }
                    handleCloseModal={() => setOpenConfirmModal(false)}
                    handleYes={classData.isOwner ? handleDeleteClass : handleLeaveClass}
                />
            )}

            {openEditModal && (
                <EditClassModal
                    initFormData={classData}
                    handleSubmit={handleUpdateClass}
                    handleCloseModal={() => setOpenEditModal(false)}
                />
            )}
        </>
    ) : (
        <Loading />
    );
}
