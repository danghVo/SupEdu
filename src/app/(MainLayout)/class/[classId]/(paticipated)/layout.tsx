import { redirect } from 'next/navigation';
import Main from './components/Main';
import RightSideBar from './components/RightSideBar';

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

let role = '';

export default function Layout({
    children,
    params: { classId },
}: {
    children: React.ReactNode;
    params: { classId: string };
}) {
    return (
        <div className="flex h-screen">
            {role === 'nonparticipating' ? (
                redirect(`/class/${classId}`)
            ) : (
                <>
                    <Main classId={classId}>{children}</Main>
                    <RightSideBar />
                </>
            )}
        </div>
    );
}
