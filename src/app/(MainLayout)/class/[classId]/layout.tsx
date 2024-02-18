import Main from './components/Main';
import RightSideBar from './components/RightSideBar';
import { redirect, usePathname } from 'next/navigation';

export function generateStaticParams() {
    // fetch class data

    return [{ classId: '1' }, { classId: '2' }, { classId: '3' }];
}

// const data = {
//     id: 0,
//     name: 'Lớp A',
//     teacher: {
//         name: 'Man A',
//         avartar: '',
//     },
//     description: 'Class Of A',
//     background: {
//         from: 'from-[#0c7076]',
//         to: 'to-[#9d0020]',
//     },
//     isLive: true,
//     exercises: [
//         {
//             name: 'Task A',
//             isDone: true,
//         },
//         {
//             name: 'Task B',
//             isDone: false,
//         },
//         {
//             name: 'Task B',
//             isDone: false,
//         },
//     ],
// };

export default function Layout({ children, params }: { children: React.ReactNode; params: { classId: string } }) {
    return (
        <div className="flex h-screen">
            <Main>{children}</Main>
            <RightSideBar />
        </div>
    );
}
