'use client';

import classNames from 'classnames/bind';

import styles from './Button.module.scss';

const cs = classNames.bind(styles);

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    children?: React.ReactNode;
    className?: string;
    href?: string;
    size?: string;
    theme?: string;
    icon?: React.ReactNode;
    handleClick: () => void;
}

export default function Button({
    children,
    className = '',
    href = '',
    theme = 'default',
    size = 'medium',
    icon = null,
    handleClick,
    ...passprops
}: ButtonProps) {
    const handleClickButton = (e: React.MouseEvent) => {
        if (href) {
            window.open(href, '_blank');
        }

        handleClick();
    };

    return (
        <button
            className={`flex items-center justify-center font-medium px-[8px] py-[12px] gap-[8px] rounded-[25px] ${className} ${cs(size, theme)}`}
            {...passprops}
            onClick={handleClickButton}
        >
            <span className="">{children}</span>
            {icon && <div>{icon}</div>}
        </button>
    );
}
