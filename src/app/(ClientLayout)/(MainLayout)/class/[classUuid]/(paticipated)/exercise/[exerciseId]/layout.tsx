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
import { PostController } from '~/controller';
import ExerciseNav from './components/ExerciseNav';

export async function generateStaticParams({ params: { classUuid } }: { params: { classUuid: string } }) {
    // fetch exercise
    const postController = new PostController();

    const data = await postController.getAllExercises(classUuid);

    return data.map((exercise: any) => ({ exerciseUuid: exercise.uuid }));
}

export default function Layout({
    children,
    params: { classUuid, exerciseId },
}: {
    children: React.ReactNode;
    params: { classUuid: string; exerciseId: string };
}) {
    return (
        <div>
            <ExerciseNav classUuid={classUuid} exerciseId={exerciseId} />
            {children}
        </div>
    );
}
