'use client';

import { faArrowLeft, faChartColumn, faInbox, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { useProfile, useClass } from '~/hooks';

export default function ExerciseNav({ classUuid, exerciseId }: { classUuid: string; exerciseId: string }) {
    const { data: classData, isSuccess: isClassSuccess } = useClass(classUuid);
    const { data: profileData, isSuccess: isProfileSuccess } = useProfile();
    const pathName = usePathname().split('/');

    return (
        isClassSuccess &&
        isProfileSuccess && (
            <div className="flex items-center gap-[16px] mb-[32px] mt-[-16px]">
                <Link
                    href={`/class/${classUuid}/exercise`}
                    className="w-[40px] h-[40px] bg-white shadow-custom-1 flex items-center justify-center rounded-full cursor-pointer"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                {classData.owner.uuid === profileData.uuid && (
                    <>
                        <Link
                            href={`/class/${classUuid}/exercise/${exerciseId}`}
                            className={`w-[40px] h-[40px] bg-white shadow-custom-1 flex items-center justify-center rounded-full cursor-pointer ${pathName.length === 5 ? '' : 'opacity-60'}`}
                        >
                            <FontAwesomeIcon icon={faInbox} />
                        </Link>
                        <Link
                            href={`/class/${classUuid}/exercise/${exerciseId}/score`}
                            className={`w-[40px] h-[40px] bg-white shadow-custom-1 flex items-center justify-center rounded-full cursor-pointer ${pathName[pathName.length - 1] === 'score' ? '' : 'opacity-60'}`}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </Link>
                        <Link
                            href={`/class/${classUuid}/exercise/${exerciseId}/statistic`}
                            className={`w-[40px] h-[40px] bg-white shadow-custom-1 flex items-center justify-center rounded-full cursor-pointer ${pathName[pathName.length - 1] === 'statistic' ? '' : 'opacity-60'}`}
                        >
                            <FontAwesomeIcon icon={faChartColumn} />
                        </Link>
                    </>
                )}
            </div>
        )
    );
}
