export async function generateStaticParams() {
    // fetch class data

    return [
        {
            id: '0',
        },
    ];
}

const classItem = {
    id: 0,
    name: 'Lớp A',
    teacher: {
        name: 'Man A',
        avartar: '',
    },
    description: 'Class Of A',
    background: {
        from: 'from-[#0c7076]',
        to: 'to-[#9d0020]',
    },
    isLive: true,
    exercises: [
        {
            name: 'Task A',
            isDone: true,
        },
        {
            name: 'Task B',
            isDone: false,
        },
        {
            name: 'Task B',
            isDone: false,
        },
    ],
};

export default function Page({ params }: { params: { id: string } }) {
    return (
        <div className="flex">
            <div className="grow"></div>

            <div className="w-[300px] bg-white"></div>
        </div>
    );
}
