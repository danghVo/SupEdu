import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
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

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
