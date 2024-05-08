'use client';

import Image from 'next/image';
import Link from 'next/link';
import SimpleBarReact from 'simplebar-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';

import Search from '~/components/Search';
import Input from '~/components/Input';
import { useChatInfor, useProfile } from '~/hooks';
import { UserController } from '~/controller';
import Loading from '~/components/Loading';

export default function ChatInfor() {
    const { data: profile, isSuccess: isProfileSuccess } = useProfile();
    const { data: chatInfor, isSuccess: isChatInforSuccess, refetch, isRefetching } = useChatInfor();
    const [chatInforShow, setChatInforShow] = useState<null | Array<any>>(null);
    const [openAction, setActionBox] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();
    const currentChatUuid = usePathname().split('/')[2] || 0;

    useEffect(() => {
        if (chatInfor) {
            setChatInforShow(chatInfor);
        }
    }, [chatInfor]);

    useEffect(() => {
        if (isProfileSuccess) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                socket.on(`${profile.uuid}/newMessage`, () => {
                    refetch();
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [isProfileSuccess]);

    const handleOpenChat = async () => {
        const userController = new UserController();

        const data = await userController.getUuid(email);

        if (!data.error) {
            router.push(`/chat/${data}`);
            setEmail('');
            setActionBox(false);
            setError('');
        } else {
            setError(data.error);
        }
    };

    const handleSearch = (search: string) => {
        if (isChatInforSuccess) {
            setChatInforShow([
                ...chatInfor.filter((item: any) => {
                    return item.name.toLowerCase().includes(search.toLowerCase());
                }),
            ]);
        }
    };

    return (
        <div className="bg-white h-screen px-[12px] py-[16px] w-full relative">
            <div className="flex items-center justify-between gap-[16px]">
                <div className="flex items-center gap-[16px]">
                    {isProfileSuccess && (
                        <>
                            <Image
                                src={
                                    profile.avatar !== null
                                        ? profile.avatar
                                        : profile.role === 'TEACHER'
                                          ? "/image/teacher.png"
                                          : "/image/student.png"
                                }
                                width={50}
                                height={50}
                                alt={'avatar'}
                                className="rounded-full"
                            />
                            <div className="text-[24px] font-bold line-clamp-1">{profile.name}</div>
                        </>
                    )}
                </div>
                <div
                    className="text-[20px] cursor-pointer mr-[8px]"
                    onClick={() => {
                        setActionBox((prev) => !prev);
                    }}
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </div>
            </div>
            <AnimatePresence>
                {openAction && (
                    <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-[400px] gap-[16px] absolute left-[105%] top-[24px] p-[16px] rounded-lg bg-white z-[50] shadow-custom-2"
                    >
                        <div className="relative">
                            <div className="w-full">
                                <div className="flex items-center">
                                    <Input
                                        placeholder="Nhập email..."
                                        value={email}
                                        onChange={setEmail}
                                        classNameWrapper="rounded-lg h-[40px]"
                                    />
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        onClick={() => handleOpenChat()}
                                        className="text-[24px] pl-[16px] cursor-pointer"
                                    />
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        className="text-[24px] pl-[16px] cursor-pointer"
                                        onClick={() => {
                                            setActionBox(false);
                                            setEmail('');
                                            setError('');
                                        }}
                                    />
                                </div>
                                {error && (
                                    <div className="rounded-lg w-full px-[12px] py-[4px] bg-red-200 text-red-500 mt-[12px]">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="pb-[12px]">
                <Search placeholder="Tìm kiếm người dùng..." handleSearch={handleSearch} className="mt-[16px]" />
            </div>
            {isChatInforSuccess && chatInforShow ? (
                <div className="flex grow">
                    <SimpleBarReact
                        style={{ height: 'calc(100vh - 180px)', width: '100%' }}
                        classNames={{ track: 'simplebar-track mr-2' }}
                        forceVisible="y"
                        className="mt-[16px] w-full"
                    >
                        <div className="flex flex-col gap-[24px]">
                            {chatInforShow.map((item: any) =>
                                item.lastMessage ? (
                                    <Link
                                        href={`/chat/${item.uuid}`}
                                        key={item.uuid}
                                        className="h-[60px] flex w-full items-center relative"
                                    >
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: currentChatUuid === item.uuid ? 8 : 0 }}
                                            className={
                                                currentChatUuid === item.uuid
                                                    ? 'absolute left-0 h-full bg-[var(--text-color)] rounded-lg'
                                                    : ''
                                            }
                                        ></motion.div>
                                        <Image
                                            className={`rounded-full ${currentChatUuid === item.uuid ? 'ml-[16px]' : ''}`}
                                            src={
                                                item.avatar !== null
                                                    ? item.avatar
                                                    : item.role === 'TEACHER'
                                                      ? "/image/teacher.png"
                                                      : "/image/student.png"
                                            }
                                            width={50}
                                            height={50}
                                            alt="avatar"
                                        />
                                        <div className="ml-[12px] overflow-hidden">
                                            <div className="font-semibold text-[18px]">{item.name}</div>
                                            <div
                                                className={`${item.lastMessage.isRead || item.lastMessage.fromUserUuid === profile.uuid ? 'opacity-50' : ''} flex`}
                                            >
                                                {item.lastMessage?.fromUser && (
                                                    <div>
                                                        {item.lastMessage.fromUserUuid === profile.uuid
                                                            ? 'Bạn:'
                                                            : item.lastMessage.fromUser.name + ':'}
                                                    </div>
                                                )}

                                                <div className="truncate ml-[4px]">
                                                    {JSON.parse(item.lastMessage.content).blocks[0].text}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ) : null,
                            )}
                        </div>
                    </SimpleBarReact>
                </div>
            ) : (
                <Loading className="translate-y-[-200px] text-[24px]" />
            )}
        </div>
    );
}
