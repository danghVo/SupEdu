import classNames from 'classnames/bind';
import {AnimatePresence, motion} from 'framer-motion';

import styles from './Button.module.scss';
import { useEffect, useRef, useState } from 'react';

const cs = classNames.bind(styles);

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    children?: React.ReactNode;
    className?: string;
    href?: string;
    size?: string;
    theme?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    handleClick: (e?: any) => void;
}

export default function Button({
    children,
    className = '',
    href = '',
    theme = 'default',
    size = 'medium',
    icon = null,
    disabled = false,
    handleClick,
}: ButtonProps) {
    const [animation, setAnaimation] = useState(false);
    const [mountPoint, setMountPoint] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement | null>(null);    

    useEffect(() => {
        if (animation) {
            setTimeout(() => {

                setAnaimation(false);
            }, 600);
        }
    }, [animation])

    const handleClickButton = (e: React.MouseEvent) => {
        if (!disabled && buttonRef.current) {
            if (href) {
                window.open(href, '_blank');
            }
            
            const clientRect = buttonRef.current.getBoundingClientRect();
            setMountPoint({
                x: e.clientX - clientRect.left,
                y: e.clientY - clientRect.top,
            })

            setAnaimation(true);

            handleClick();
        }
    };

    return (
        <button
            ref={buttonRef}
            className={`relative overflow-hidden flex items-center justify-center font-medium px-[8px] py-[12px] gap-[8px] rounded-[25px] ${className} ${cs(size, theme)} ${disabled ? 'opacity-80 cursor-not-allowed' : ''}`}
            onClick={handleClickButton}
        >
            <AnimatePresence> 
                {animation && 
                    <motion.div
                        key={Math.random()}
                        initial={{ scale: 0, left: mountPoint.x, top: mountPoint.y, x: '-50%', y: '-50%'}}
                        animate={{ scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ width: buttonRef.current!.clientWidth * 2 + 'px', height: buttonRef.current!.clientWidth * 2 + 'px' }}
                        className={`absolute bg-slate-400/50 rounded-full`}></motion.div>
                }
            </AnimatePresence>
            <span className="">{children}</span>
            {icon && <div>{icon}</div>}
        </button>
    );
}
