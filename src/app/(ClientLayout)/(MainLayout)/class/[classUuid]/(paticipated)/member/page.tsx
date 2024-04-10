'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faComment, faUserMinus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import Link from 'next/link';

import AddMember from './components/AddMember';
import Selection from '~/components/Selection';
import Search from '~/components/Search';
import MemberCard from '../components/MemberCard';
import { useMembers, useClass } from '~/hooks';
import { ClassController } from '~/controller';
import ConfirmModal from '~/components/Modal/ConfirmModal';
import { useProfile } from '~/hooks';
import { NotificationTheme } from '~/app/(ClientLayout)/(MainLayout)/layout';
import { NotificationType } from '~/components/Notification';

export default function Member({ params: { classUuid } }: { params: { classUuid: string } }) {
    const { data: members, isSuccess: isMemberSuccess, refetch, isRefetching } = useMembers(classUuid);
    const { data: classData, isSuccess: isClassSuccess } = useClass(classUuid);
    const { data: profile } = useProfile();
    const [membersShow, setMembersShow] = useState<any[] | null>(null);
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        userUuid: '',
    });
    const [currentFilter, setCurrentFilter] = useState('Đã tham gia');
    const queryClient = useQueryClient();
    const notificationShow = useContext(NotificationTheme);

    useEffect(() => {
        if (isMemberSuccess && isClassSuccess) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                socket.on(`${classData.uuid}/member`, () => {
                    refetch();
                    setCurrentFilter('Đã tham gia');
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [isMemberSuccess, isClassSuccess]);

    useLayoutEffect(() => {
        if (isMemberSuccess && !isRefetching) {
            if (members.error) {
                setMembersShow([]);
            } else setMembersShow(members.filter((member: any) => member.status === 'JOINED'));
        }
    }, [isMemberSuccess, isRefetching]);

    useEffect(() => {
        if (members) {
            if (currentFilter === 'Đã tham gia') {
                setMembersShow(members.filter((member: any) => member.status === 'JOINED'));
            } else if (currentFilter === 'Chờ xét duyệt') {
                setMembersShow(members.filter((member: any) => member.status === 'PENDING'));
            }
        }
    }, [currentFilter]);

    const handleChangeUI = (selection: string) => {
        setCurrentFilter(selection);
    };

    const handleSearch = (value: string) => {
        if (membersShow) {
            setMembersShow(membersShow.filter((member: any) => member.user.name.includes(value)));
        }
    };

    const handleRemoveMember = async () => {
        const classController = new ClassController();

        const res = await classController.removeMember(classUuid, confirmModal.userUuid);

        if (!res.error) {
            notificationShow('Xóa thành viên thành công', NotificationType.success);
            refetch();
        } else notificationShow(res.error, NotificationType.error);
    };

    const handleAddMember = async (email: string) => {
        const classController = new ClassController();

        const res = await classController.addMember(classUuid, email);

        if (!res.error) {
            refetch();
            notificationShow('Thêm thành viên thành công', NotificationType.success);
            return '';
        } else {
            notificationShow(res.error, NotificationType.error);
            return res.error;
        }
    };

    const handleResponseJoinClass = async (userUuid: string, approve: boolean) => {
        const classController = new ClassController();

        const res = await classController.responseJoinClass(classUuid, userUuid, approve);

        if (!res.error) {
            refetch();
            notificationShow('Phê duyệt thành viên thành công', NotificationType.success);
        }
    };

    return (
        isMemberSuccess &&
        isClassSuccess &&
        membersShow && (
            <>
                <div className="mt-[-16px]">
                    {classData.isOwner && (
                        <AddMember handleSubmit={handleAddMember} link={`http://localhost:3000/class/${classUuid}`} />
                    )}

                    <div className="flex flex-col items-center justify-center mb-[32px]">
                        <div
                            className="w-[80%] font-semibold text-[16px] mb-[16px]"
                            style={{ color: classData.textColor }}
                        >
                            Giáo viên
                        </div>
                        <MemberCard
                            infor={classData.owner}
                            actionsElement={
                                !classData.isOwner ? (
                                    <Link href={`/chat/${classData.owner.uuid}`} className="text-[24px] cursor-pointer">
                                        <FontAwesomeIcon icon={faComment} />
                                    </Link>
                                ) : undefined
                            }
                        />
                    </div>
                    <div className="flex justify-center mb-[24px] rounded-lg">
                        <div className="w-[80%] flex items-center justify-between">
                            <div style={{ color: classData.textColor }}>
                                <span className="font-semibold mr-[16px] text-[18px]">Số lượng:</span>
                                {membersShow.length}
                            </div>
                            {classData.isOwner && (
                                <Selection
                                    className="w-fit bg-black rounded-lg cursor-pointer text-white"
                                    label="Trạng thái"
                                    optionData={['Đã tham gia', 'Chờ xét duyệt']}
                                    defaultSelection={currentFilter}
                                    onChange={handleChangeUI}
                                />
                            )}
                            <div>
                                <Search handleSearch={handleSearch} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-[16px]">
                        {membersShow.length === 0 ? (
                            <div className="mt-[16px] text-[18px] font-bold" style={{ color: classData.textColor }}>
                                Không có thành viên nào
                            </div>
                        ) : (
                            membersShow.map((infor: any, index: number) => (
                                <MemberCard
                                    key={index}
                                    infor={infor.user}
                                    actionsElement={
                                        <>
                                            {infor.user.uuid !== profile.uuid && (
                                                <Link
                                                    href={`/chat/${infor.user.uuid}`}
                                                    className="text-[24px] cursor-pointer"
                                                >
                                                    <FontAwesomeIcon icon={faComment} />
                                                </Link>
                                            )}
                                            {classData.isOwner &&
                                                (infor.status === 'PENDING' ? (
                                                    <>
                                                        <div
                                                            onClick={() =>
                                                                handleResponseJoinClass(infor.user.uuid, true)
                                                            }
                                                            className="text-[24px] cursor-pointer text-green-400"
                                                        >
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </div>
                                                        <div
                                                            onClick={() =>
                                                                handleResponseJoinClass(infor.user.uuid, false)
                                                            }
                                                            className="text-[24px] cursor-pointer text-red-400"
                                                        >
                                                            <FontAwesomeIcon icon={faXmark} />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div
                                                        className="text-[24px] cursor-pointer"
                                                        onClick={() =>
                                                            setConfirmModal({ open: true, userUuid: infor.user.uuid })
                                                        }
                                                    >
                                                        <FontAwesomeIcon icon={faUserMinus} />
                                                    </div>
                                                ))}
                                        </>
                                    }
                                />
                            ))
                        )}
                    </div>
                </div>

                {confirmModal.open && (
                    <ConfirmModal
                        title="Bạn có chắc chắn muốn xóa thành viên này không ?"
                        handleCloseModal={() => setConfirmModal({ open: false, userUuid: '' })}
                        handleYes={handleRemoveMember}
                    />
                )}
            </>
        )
    );
}
