import { useRef } from 'react';
import NavItem from './NavItem';

export default function Nav() {
    const navLink = useRef(['Trang chủ', '']);

    return (
        <div className="flex flex-1 ml-12 h-full ">
            <NavItem />
        </div>
    );
}
