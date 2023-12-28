import Link from 'next/link';

const navDatas = [{ name: 'Trang chủ', to: '/' }];

export default function NavItem() {
    return (
        <>
            {navDatas.map((item, index) => (
                <Link
                    href={item.to}
                    className="px-9 uppercase font-bold hover:text-white hover:bg-black h-full flex items-center"
                    key={index}
                >
                    <div>{item.name}</div>
                </Link>
            ))}
        </>
    );
}
