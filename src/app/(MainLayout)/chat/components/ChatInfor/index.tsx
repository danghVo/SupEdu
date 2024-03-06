import Image from 'next/image';
import SimpleBarReact from 'simplebar-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import image from '~/assets/image';
import Search from '~/components/Search';
import testData from './testData.json';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCheck, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Input from '~/components/Input';

export default function ChatInfor({ currnetChat }: { currnetChat: string }) {
    const [openAction, setActionBox] = useState(false);
    const [email, setEmail] = useState('');
    const [openEmailType, setOpenEmailTyping] = useState(false);

    return (
        <div className="bg-white h-screen px-[12px] py-[16px] w-full relative">
            <div className="flex items-center justify-between gap-[16px]">
                <div className="flex items-center gap-[16px]">
                    <Image src={image.student} alt={'avatar'} className="w-[50px] h-[50px] rounded-full" />
                    <div className="text-[24px] font-bold">student</div>
                </div>
                <div
                    className="text-[20px] cursor-pointer mr-[8px]"
                    onClick={() => {
                        setActionBox((prev) => !prev);
                    }}
                >
                    <FontAwesomeIcon icon={faGear} />
                </div>
            </div>
            <AnimatePresence>
                {openAction && (
                    <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-fit gap-[16px] absolute left-[105%] top-[24px] p-[16px] rounded-lg bg-white z-[50] shadow-custom-2"
                    >
                        <div className="relative">
                            {openEmailType ? (
                                <div className="flex items-center w-full">
                                    <Input
                                        placeholder="Nhập email..."
                                        value={email}
                                        onChange={setEmail}
                                        classNameWrapper="rounded-lg h-[40px]"
                                    />
                                    <FontAwesomeIcon icon={faCheck} className="text-[24px] pl-[16px] cursor-pointer" />
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        className="text-[24px] pl-[16px] cursor-pointer"
                                        onClick={() => {
                                            setOpenEmailTyping(false);
                                        }}
                                    />
                                </div>
                            ) : (
                                <Button
                                    className=" w-[200px] rounded-lg"
                                    handleClick={() => {
                                        setOpenEmailTyping((prev) => !prev);
                                    }}
                                    theme={openEmailType ? 'fill' : 'default'}
                                >
                                    Gửi tin nhắn
                                </Button>
                            )}
                        </div>
                        <Button className="mt-[16px] w-[200px] rounded-lg" handleClick={() => {}}>
                            Tin nhắn từ người lạ
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="pb-[12px]">
                <Search placeholder="Tìm kiếm người dùng..." handleSearch={() => {}} className="mt-[16px]" />
            </div>
            <div className="flex grow">
                <SimpleBarReact
                    style={{ height: 'calc(100vh - 180px)', width: '100%' }}
                    classNames={{ track: 'simplebar-track mr-2' }}
                    forceVisible="y"
                    className="mt-[16px] w-full"
                >
                    <div className="flex flex-col gap-[24px]">
                        {testData.map((item, index) => (
                            <Link
                                href={`/chat/${item.id}`}
                                key={index}
                                className="h-[60px] flex w-full items-center relative"
                            >
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: currnetChat === item.id ? 8 : 0 }}
                                    className={
                                        currnetChat === item.id
                                            ? 'absolute left-0 h-full bg-[var(--text-color)] rounded-lg'
                                            : ''
                                    }
                                ></motion.div>
                                <Image
                                    className={`w-[50px] h-[50px] rounded-full ${currnetChat === item.id ? 'ml-[16px]' : ''}`}
                                    src={item.avatar || image.student}
                                    alt="avatar"
                                />
                                <div className="ml-[12px] overflow-hidden">
                                    <div className="font-semibold text-[18px]">{item.name}</div>
                                    <div className="text-slate-400 truncate">{item.lastMessage}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </SimpleBarReact>
            </div>
        </div>
    );
}
