import SideBar from './components/SideBar';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            <SideBar />
            <div className="grow bg-main ml-[48px]">{children}</div>
        </div>
    );
}
