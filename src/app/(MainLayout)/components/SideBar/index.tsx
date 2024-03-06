'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { faBell, faComment, faCalendar, faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboard, faGear } from '@fortawesome/free-solid-svg-icons';

import image from '~/assets/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Announcenment from '../Annoucement';

const mainItem = [
    { name: 'Lớp học', to: '/class', icon: faChalkboard },
    { name: 'Chat', to: '/chat', icon: faComment },
    // { name: 'Thông báo', to: '#', icon: faBell },
    { name: 'Lịch', to: '/calendar', icon: faCalendar },
];

export default function SideBar() {
    const pathName = usePathname();
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(mainItem.findIndex((item) => pathName.includes(item.to)));
    const [openAnnounce, setOpenAnnounce] = useState(false);

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
                        <Image src={image.logo} alt="Logo" width={100} className="min-w-[40px]" />
                    </div>

                    <div className="my-[16px] border-b-2 border-solid border-slate-100">
                        <div
                            onClick={() => setOpenAnnounce((prev) => !prev)}
                            className={`flex items-center  ${!open ? 'justify-center' : 'px-[16px] mx-[8px]'}
                    text-[16px] py-[12px] my-[24px] cursor-pointer relative ${openAnnounce ? 'bg-slate-500 rounded-full text-white' : ''}`}
                        >
                            <div className="relative z-10 whitespace-nowrap">
                                <FontAwesomeIcon icon={faBell} className="text-[24px]" />
                                {open && <span className="ml-[8px] font-medium">Thông báo</span>}
                            </div>
                        </div>
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
                                    {open && <span className="ml-[8px] font-medi    um">{item.name}</span>}
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
                        >
                            <FontAwesomeIcon icon={faGear} className="text-[20px]" />
                            {open && <span className="ml-[8px] font-medium">Cài đặt</span>}
                        </div>
                        <div
                            className={`whitespace-nowrap flex ${
                                !open ? 'justify-center' : 'px-[16px] mx-[6px]'
                            }  mb-[8px] text-[16px] w-full py-[12px] cursor-pointer`}
                        >
                            <FontAwesomeIcon icon={faCircleQuestion} className="text-[20px]" />
                            {open && <span className="ml-[8px] font-medium">Trợ giúp</span>}
                        </div>
                    </div>
                    <div className="mb-[32px] flex items-center justify-center">
                        <div className="w-[42px] h-[42px] flex items-center justify-center border-2 border-solid border-slate-400 rounded-full p-1 ">
                            <Image src={image.student} alt="logo" className="w-[28px] h-[28px]" />
                        </div>
                        {open && (
                            <div className="ml-[12px]">
                                <div className="font-bold"> Vo </div>
                                <div> huynhvo47@gmail.com </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
            <AnimatePresence>
                {openAnnounce && (
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
                        <Announcenment />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
