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
    disabled?: boolean;
    handleClick: () => void;
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
    const handleClickButton = (e: React.MouseEvent) => {
        if (!disabled) {
            if (href) {
                window.open(href, '_blank');
            }

            handleClick();
        }
    };

    return (
        <button
            className={`flex items-center justify-center font-medium px-[8px] py-[12px] gap-[8px] rounded-[25px] ${className} ${cs(size, theme)} ${disabled ? 'opacity-80' : ''}`}
            onClick={handleClickButton}
        >
            <span className="">{children}</span>
            {icon && <div>{icon}</div>}
        </button>
    );
}
