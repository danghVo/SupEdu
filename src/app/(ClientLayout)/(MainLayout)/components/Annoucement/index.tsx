import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SimpleBarReact from 'simplebar-react';

import { useEffect, useState } from 'react';
import { NotificationController, PostController } from '~/controller';

interface Nofitcation {
    title: string;
    message: string;
    sendIn: {
        date: string;
        time: string;
    };
    link: string;
    uuid: string;
    isRead: boolean;
}

export default function Announcenment({ notifications }: { notifications: Array<Nofitcation> }) {
    const [error, setError] = useState('');
    const queryClient = useQueryClient();
    const router = useRouter();

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    }, [error]);

    const handleRead = async (e: any, announcement: Nofitcation) => {
        const notificationController = new NotificationController();
        const postController = new PostController();

        const res = await notificationController.readNotification(announcement.uuid);

        if (!res.error) {
            let uuid = '';

            if (announcement.link.includes('post')) {
                uuid = announcement.link.split('#')[1];
            } else if (announcement.link.includes('class')) {
                uuid = announcement.link.split('/')[3];
            }

            if (uuid) {
                e.stopPropagation();
                const isExist = await postController.checkExist(uuid);

                if (!isExist.error) {
                    router.push(announcement.link);
                } else {
                    setError(isExist.error);
                }
            } else {
                queryClient.invalidateQueries({
                    queryKey: ['notification'],
                });
                router.push(announcement.link);
            }
        }
    };

    const handleDelete = async (uuid: string) => {
        const notificationController = new NotificationController();

        const res = await notificationController.deleteNotification(uuid);

        if (!res.error) {
            queryClient.invalidateQueries({
                queryKey: ['notification'],
            });
        }
    };

    return (
        <>
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-red-200 text-red-500 w-[430px] px-[12px] py-[16px] mx-[12px] absolute top-[-2px] mt-[12px] rounded-lg z-[40]"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <SimpleBarReact
                style={{
                    maxHeight: '760px',
                    marginBottom: '16px',
                }}
                classNames={{ track: 'simplebar-track mr-2' }}
                forceVisible="y"
            >
                <div className="w-[430px] flex flex-col pl-[16px]">
                    {notifications.map((announcement: any) => (
                        <div
                            key={announcement.uuid}
                            className={`bg-white pl-[12px] pr-[32px] py-[16px] my-[16px] mx-[12px] shadow-custom-4 rounded-2xl relative${announcement.isRead ? ' opacity-90' : ''}`}
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(announcement.uuid);
                                }}
                                className="absolute right-[8px] top-[8px] cursor-pointer text-[24px]"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                            <div className="cursor-pointer" onClick={(e) => handleRead(e, announcement)}>
                                <div className="flex justify-between items-end mb-[16px]">
                                    <div className="font-bold text-[20px]">{announcement.title}</div>
                                    <div className="text-slate-400">
                                        {announcement.sendIn.time}, {announcement.sendIn.date}
                                    </div>
                                </div>
                                <div className="text-slate-500 px-[4px]">{announcement.message}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </SimpleBarReact>
        </>
    );
}
