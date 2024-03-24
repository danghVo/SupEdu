'use client';

import { redirect } from 'next/navigation';
import Main from './components/Main';
import RightSideBar from './components/RightSideBar';
import useClass from '~/hooks/useClass';
import useProfile from '~/hooks/useProfile';

export default function Layout({
    children,
    params: { classUuid },
}: {
    children: React.ReactNode;
    params: { classUuid: string };
}) {
    const { data: classData, isSuccess: isClassSuccess } = useClass(classUuid);
    const { data: user, isSuccess: isUserSuccess } = useProfile();

    return (
        <div className="flex h-screen">
            {isClassSuccess && isUserSuccess && (
                <>
                    {classData.status === 'JOINED' || classData.owner.uuid === user.uuid ? (
                        <>
                            <Main classUuid={classUuid}>{children}</Main>
                            <RightSideBar />
                        </>
                    ) : (
                        redirect(`/class/${classUuid}`)
                    )}
                </>
            )}
        </div>
    );
}
