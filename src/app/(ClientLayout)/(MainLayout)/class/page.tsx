'use client';

import ClassItem from './components/classItem';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Selection from '~/components/Selection';
import { useQueryClient } from '@tanstack/react-query';
import { ClassController } from '~/controller/class.controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import EditClassModal, { FormData } from './components/editClassModal';
import JoinModal from './components/joinModal';
import useProfile from '~/hooks/useProfile';
import Loading from '~/components/Loading';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { io } from 'socket.io-client';
import { NotificationTheme } from '../layout';
import { NotificationType } from '~/components/Notification';

export default function Page() {
    const [classShow, setClassShow] = useState<Array<any> | null>(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openJoinModal, setOpenJoinModal] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('');
    const queryClient = useQueryClient();
    const { data: user, isSuccess, isFetching } = useProfile();
    const notificationShow = useContext(NotificationTheme);

    useEffect(() => {
        if (isSuccess) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                socket.on(`${user.uuid}/addToClass`, () => {
                    fetchClasses('Đang tham gia');
                });

                socket.on(`${user.uuid}/removed`, () => {
                    fetchClasses('Đang tham gia');
                });

                socket.on(`${user.uuid}/requestClass`, () => {
                    fetchClasses('Đang tham gia');
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [isSuccess]);

    useEffect(() => {
        if (currentFilter) {
            fetchClasses();
        }
    }, [currentFilter]);

    const filter = useMemo(() => {
        if (user) {
            return user.role === 'TEACHER'
                ? ['Sở hữu', 'Đang tham gia', 'Chờ xác nhận']
                : ['Đang tham gia', 'Chờ xác nhận'];
        } else return [];
    }, [user]);

    const fetchClasses = async (selection?: string) => {
        const classController = new ClassController();
        const filterName = selection || currentFilter;
        let filter = '';

        if (filterName === 'Sở hữu') {
            filter = 'own';
        } else if (filterName === 'Đang tham gia') {
            filter = 'join';
        } else if (filterName === 'Chờ xác nhận') {
            filter = 'waiting';
        }

        const data = await queryClient.fetchQuery({
            queryKey: ['classShow', filter],

            queryFn: () => classController.getClasses(filter),
        });

        if (!data.error) {
            setClassShow(data);
        }
    };

    const handleCreateClass = async (formData: FormData) => {
        if (user) {
            const classController = new ClassController();
            const data = await classController.createClass(formData);

            if (!data.error) {
                fetchClasses('Sở hữu');
                setOpenEditModal(false);
                notificationShow('Tạo lớp học thành công', NotificationType.success);
            } else {
                notificationShow(data.error, NotificationType.error);
            }
        }
    };

    const handleSelectedFilter = (selection: string) => {
        setCurrentFilter(selection);
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
                            onChange={handleSelectedFilter}
                            optionData={filter}
                        />
                    </div>
                )}
                {isSuccess && user.role === 'TEACHER' && (
                    <Button
                        handleClick={() => {
                            setOpenEditModal(true);
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
            {isFetching || !classShow ? (
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

            {openEditModal && (
                <EditClassModal
                    handleSubmit={handleCreateClass}
                    handleCloseModal={() => {
                        setOpenEditModal(false);
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
