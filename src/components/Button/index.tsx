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
            className={`flex items-center font-medium px-12 py-8 rounded-[25px] ${className} ${cs(size, theme)}`}
            {...passprops}
            onClick={handleClickButton}
        >
            <span className="block w-full text-center">{children}</span>
            {icon && <div>{icon}</div>}
        </button>
    );
}
