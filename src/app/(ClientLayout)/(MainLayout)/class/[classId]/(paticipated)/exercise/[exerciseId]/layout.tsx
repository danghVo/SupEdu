import {
    faArrowCircleLeft,
    faArrowLeft,
    faChartColumn,
    faInbox,
    faPen,
    faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export async function generateStaticParams({ params: { classId } }: { params: { classId: string } }) {
    // fetch exercise

    return [
        {
            exerciseId: '0',
        },
        {
            exerciseId: '1',
        },
    ];
}

export default function Layout({
    children,
    params: { classId, exerciseId },
}: {
    children: React.ReactNode;
    params: { classId: string; exerciseId: string };
}) {
    return (
        <div>
            <div className="flex items-center gap-[16px] mb-[32px] mt-[-16px]">
                <Link
                    href={`/class/${classId}/exercise`}
                    className="w-[40px] h-[40px] bg-white shadow-custom-1 flex items-center justify-center rounded-full cursor-pointer"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <Link
                    href={`/class/${classId}/exercise/${exerciseId}`}
                    className="w-[40px] h-[40px] bg-white shadow-custom-1 flex items-center justify-center rounded-full cursor-pointer"
                >
                    <FontAwesomeIcon icon={faInbox} />
                </Link>
                <Link
                    href={`/class/${classId}/exercise/${exerciseId}/score`}
                    className="w-[40px] h-[40px] bg-white shadow-custom-1 flex items-center justify-center rounded-full cursor-pointer"
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
                <Link
                    href={`/class/${classId}/exercise/${exerciseId}/statistic`}
                    className="w-[40px] h-[40px] bg-white shadow-custom-1 flex items-center justify-center rounded-full cursor-pointer"
                >
                    <FontAwesomeIcon icon={faChartColumn} />
                </Link>
            </div>
            {children}
        </div>
    );
}
