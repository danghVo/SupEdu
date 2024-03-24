'use client';

import image from '~/assets/image';
import ClassItem from './components/classItem';
import { useEffect, useMemo, useRef, useState } from 'react';
import Selection from '~/components/Selection';
import { useQueryClient } from '@tanstack/react-query';
import { ClassController } from '~/controller/class.controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import CreateClassModal from './components/createClassModal';
import JoinModal from './components/joinModal';
import useProfile from '~/hooks/useProfile';
import Loading from '~/components/Loading/intex';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
    const [classShow, setClassShow] = useState<Array<any>>([]);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openJoinModal, setOpenJoinModal] = useState(false);
    const queryClient = useQueryClient();
    const { data: user, isSuccess, refetch, isFetching } = useProfile();
    const router = useRouter();

    const filter = useMemo(() => {
        if (user) {
            return user.role === 'TEACHER'
                ? ['Sở hữu', 'Đang tham gia', 'Chờ xác nhận']
                : ['Đang tham gia', 'Chờ xác nhận'];
        } else return [];
    }, [user]);

    const fetchClasses = async (seletion: string) => {
        const classController = new ClassController();

        let filter = '';

        if (seletion === 'Sở hữu') {
            filter = 'owner';
        } else if (seletion === 'Đang tham gia') {
            filter = 'join';
        } else if (seletion === 'Chờ xác nhận') {
            filter = 'waiting';
        }

        const data = await queryClient.fetchQuery({
            queryKey: ['classShow', filter],

            queryFn: () => classController.getClasses(filter),
        });

        setClassShow(data);
    };

    return (
        <div className="px-[24px] py-[32px] min-h-full mx-[12px]">
            <div className="font-bold text-[32px] mb-[32px]">Các lớp học của bạn</div>

            <div className="mb-[64px] flex items-center gap-[16px]">
                {filter.length > 0 && (
                    <div className={` font-semibold text-[18px] bg-[var(--text-color)] rounded-[25px]`}>
                        <Selection
                            className="text-white"
                            label="Lớp học"
                            defaultSelection={filter[0]}
                            onChange={(selection) => fetchClasses(selection)}
                            optionData={filter}
                        />
                    </div>
                )}
                {isSuccess && user.role === 'TEACHER' && (
                    <Button
                        handleClick={() => {
                            setOpenCreateModal(true);
                        }}
                        className="min-w-[150px] w-[200px]"
                    >
                        <FontAwesomeIcon className="mr-[12px]" icon={faPlus} />
                        Tạo lớp mới
                    </Button>
                )}
                <Button
                    handleClick={() => {
                        setOpenJoinModal(true);
                    }}
                    className="min-w-[150px] w-[200px]"
                >
                    <FontAwesomeIcon className="mr-[12px]" icon={faRightToBracket} />
                    Tham gia lớp
                </Button>
            </div>
            {isFetching ? (
                <Loading />
            ) : classShow.length === 0 ? (
                <div className="text-[32px] font-bold text-center ">Không có lớp phù hợp</div>
            ) : (
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-x-[32px] gap-y-[64px] justify-center">
                    {classShow.map((item, index) => (
                        <Link href={`/class/${item.uuid}`} key={index} className="cursor-pointer">
                            <ClassItem classItem={item} />
                        </Link>
                    ))}
                </div>
            )}

            {openCreateModal && (
                <CreateClassModal
                    refetchClass={fetchClasses}
                    handleCloseModal={() => {
                        setOpenCreateModal(false);
                    }}
                />
            )}

            {openJoinModal && (
                <JoinModal
                    handleCloseModal={() => {
                        setOpenJoinModal(false);
                    }}
                />
            )}
        </div>
    );
}
