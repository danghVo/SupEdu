import {
    faCircleCheck,
    faCircleExclamation,
    faTriangleExclamation,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createContext, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export enum NotificationType {
    success,
    error,
    warning,
}

const messageColor: { [key in NotificationType]: string } = {
    [NotificationType.success]: 'bg-green-500',
    [NotificationType.error]: 'bg-red-500',
    [NotificationType.warning]: 'bg-yellow-500',
};

const messageIcon: { [key in NotificationType]: IconDefinition } = {
    [NotificationType.success]: faCircleCheck,
    [NotificationType.error]: faCircleExclamation,
    [NotificationType.warning]: faTriangleExclamation,
};

function Notification({}, ref: any) {
    const [notification, setNotification] = useState<{ message: string; type: NotificationType }>({
        message: '',
        type: NotificationType.success,
    });

    useEffect(() => {
        if (notification.message) {
            setTimeout(() => {
                setNotification({ message: '', type: NotificationType.success });
            }, 5000);
        }
    }, [notification.message]);

    useImperativeHandle(ref, () => ({
        show: (message: string, type: NotificationType) => {
            setNotification({ message, type });
        },
    }));

    return (
        <AnimatePresence>
            {notification.message ? (
                <motion.div
                    initial={{ right: -200 }}
                    animate={{ right: 16 }}
                    exit={{ right: -200 }}
                    className={`absolute top-8 z-[999] min-w-[300px] h-[70px] text-[32px] rounded-2xl text-white flex items-center px-[16px] ${messageColor[notification.type]}`}
                >
                    <FontAwesomeIcon icon={messageIcon[notification.type]} />
                    <span className="text-[16px] font-medium ml-[12px]">{notification.message}</span>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

export default forwardRef(Notification);
