'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faComment } from '@fortawesome/free-regular-svg-icons';
import { faChalkboard, faRightFromBracket, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { NotificationController, UserController } from '~/controller';
import { useClasses, useProfile, useNotification } from '~/hooks';
import Announcenment from '../Annoucement';

import Button from '~/components/Button';

const mainItem = [
    { name: 'Lớp học', to: '/class', icon: faChalkboard },
    { name: 'Hồ sơ', to: '/profile', icon: faUserEdit },
    { name: 'Chat', to: '/chat', icon: faComment },
];

export default function SideBar() {
    const pathName = usePathname();
    const [open, setOpen] = useState(false);
    const { data: notifications, isSuccess: isNotificationSuccess } = useNotification();
    const { data: classes, isSuccess: isClassesSuccess } = useClasses();
    const { data: user, isSuccess: isUserSuccess } = useProfile();
    const [active, setActive] = useState(mainItem.findIndex((item) => pathName.includes(item.to)));
    const [openAnnounce, setOpenAnnounce] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isClassesSuccess && isUserSuccess && !classes.error) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                classes.forEach((classItem: any) => {
                    socket.on(`${classItem.uuid}/notification`, () => {
                        queryClient.invalidateQueries({
                            queryKey: ['notification'],
                        });
                    });
                });

                socket.on(`${user.uuid}/notification`, () => {
                    queryClient.invalidateQueries({
                        queryKey: ['notification'],
                    });
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [isClassesSuccess, isUserSuccess]);

    const handleLogout = async () => {
        const userController = new UserController();
        const data = await userController.logOut(user.uuid);
        if (!data.error) {
            window.localStorage.removeItem('token');
            queryClient.removeQueries();
            router.push('/SignIn');
        }
    };

    const countUnread =
        (!notifications?.error &&
            notifications?.filter((notification: { isRead: boolean }) => !notification.isRead).length) ||
        0;

    const handleClearAll = async () => {
        const notificationController = new NotificationController();

        const res = await notificationController.deleteAllNotification();

        if (!res.error) {
            queryClient.invalidateQueries({
                queryKey: ['notification'],
            });
        }
    };

    return (
        <div
            className={`flex fixed z-[999]`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => {
                setOpen(false);
                setOpenAnnounce(false);
            }}
        >
            <motion.div
                initial={{ width: '50px' }}
                animate={{ width: open ? '250px' : '50px' }}
                className={`h-screen px-[4px] border-r-2 border-slate-300 border-solid bg-white ${
                    open ? 'w-[250px] shadow-custom-1' : 'w-[50px]'
                } overflow-hidden flex flex-col justify-between`}
            >
                <div>
                    <div className="flex border-b-2 border-solid border-slate-100 py-[16px] border-">
                        <Image src={"/image/logo.png"} alt="Logo" width={100} height={100} className="min-w-[40px]" />
                    </div>

                    <div className="my-[16px] border-b-2 border-solid border-slate-100">
                        {isNotificationSuccess && (
                            <div className="my-[24px]">
                                <div
                                    onClick={() => setOpenAnnounce((prev) => !prev)}
                                    className={`flex items-center  ${!open ? 'justify-center' : 'px-[16px] mx-[8px]'}
                        text-[16px] py-[12px] cursor-pointer relative ${openAnnounce ? 'bg-slate-500 rounded-full text-white' : ''}`}
                                >
                                    <div className="relative z-10 whitespace-nowrap flex">
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faBell} className="text-[24px]" />
                                            {countUnread > 0 && (
                                                <div className="absolute px-[6px] text-[14px] bg-red-500 rounded-full text-white top-[-12px] right-[-12px]">
                                                    {countUnread}
                                                </div>
                                            )}
                                        </div>
                                        {open && <span className="ml-[12px] font-medium">Thông báo</span>}
                                    </div>
                                </div>
                                {openAnnounce && (
                                    <Button
                                        disabled={notifications.length === 0}
                                        className="w-[240px] mt-[12px] px-[32px]"
                                        theme="fill"
                                        handleClick={() => {
                                            handleClearAll();
                                        }}
                                    >
                                        Xóa tất cả thông báo
                                    </Button>
                                )}
                            </div>
                        )}

                        {mainItem.map((item, index) => (
                            <Link
                                onClick={() => setActive(index)}
                                key={index}
                                href={item.to}
                                className={`flex items-center  ${!open ? 'justify-center' : 'px-[16px] mx-[8px]'} ${
                                    active === index ? 'text-white' : ''
                                } text-[16px] py-[12px] my-[8px] cursor-pointer relative`}
                            >
                                <AnimatePresence>
                                    {active === index && (
                                        <motion.div
                                            className={`absolute top-0 left-0 w-full h-full bg-[var(--text-color)] shadow-custom-4`}
                                            initial={{ opacity: 0.5, borderRadius: '999px' }}
                                            animate={{ opacity: 1, borderRadius: '999px' }}
                                            exit={{ opacity: 0, borderRadius: '0' }}
                                        ></motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="relative z-10 whitespace-nowrap">
                                    <FontAwesomeIcon icon={item.icon} className="text-[20px]" />
                                    {open && <span className="ml-[8px] font-medium">{item.name}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="self-center">
                    <div className=" border-b-2 border-solid border-slate-100 mb-[16px] my-[32px]">
                        <div
                            className={`whitespace-nowrap flex ${
                                !open ? 'justify-center' : 'px-[16px] mx-[6px]'
                            }  mb-[8px] text-[16px] w-full py-[12px] cursor-pointer`}
                            onClick={() => handleLogout()}
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} className="text-[20px]" />
                            {open && <span className="ml-[8px] font-medium">Đăng xuất</span>}
                        </div>
                    </div>
                    {isUserSuccess && (
                        <div className="mb-[32px] flex items-center justify-center">
                            <div className="w-[42px] h-[42px] flex items-center justify-center border-2 border-solid border-slate-400 rounded-full p-1 overflow-hidden">
                                <Image
                                    src={
                                        user.avatar !== null
                                            ? user.avatar
                                            : user.role === 'TEACHER'
                                              ? "/image/teacher.png"
                                              : "/image/student.png"
                                    }
                                    width={28}
                                    height={28}
                                    alt="logo"
                                />
                            </div>
                            {open && (
                                <div className="ml-[12px] w-[150px]">
                                    <div className="font-bold"> {user.name} </div>
                                    <div className="w-full truncate"> {user.email} </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
            <AnimatePresence>
                {openAnnounce && isNotificationSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-[60px]"
                        onClick={() => {
                            setOpenAnnounce(false);
                            setOpen(false);
                        }}
                        onMouseEnter={() => {
                            setOpen(true);
                        }}
                    >
                        <Announcenment notifications={notifications} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
