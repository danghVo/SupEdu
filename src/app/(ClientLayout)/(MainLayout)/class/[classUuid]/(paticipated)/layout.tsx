'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';

import Main from './components/Main';
import RightSideBar from './components/RightSideBar';
import { useClass, useProfile } from '~/hooks';

export default function Layout({
    children,
    params: { classUuid },
}: {
    children: React.ReactNode;
    params: { classUuid: string };
}) {
    const { data: classData, isSuccess: isClassSuccess, refetch: refetchClass } = useClass(classUuid);
    const { data: user, isSuccess: isUserSuccess } = useProfile();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isClassSuccess && isUserSuccess) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                socket.on(`${user.uuid}/removed`, () => {
                    refetchClass();
                    queryClient.invalidateQueries({
                        queryKey: ['classes', 'join'],
                    });
                });

                socket.on(`${classData.uuid}`, () => {
                    refetchClass();
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [isClassSuccess, isUserSuccess]);

    return (
        <div className="flex h-screen">
            {isClassSuccess && (
                <>
                    {classData.status === 'JOINED' || classData.isOwner ? (
                        <>
                            <Main classUuid={classUuid}>{children}</Main>
                            <RightSideBar classUuid={classUuid} />
                        </>
                    ) : (
                        redirect(`/class/${classUuid}`)
                    )}
                </>
            )}
        </div>
    );
}
