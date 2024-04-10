'use client';

import { useDebounce, useFile, useProfile } from '~/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

import Loading from '../loading';
import image from '~/assets/image';
import Input from '~/components/Input';
import Button from '~/components/Button';
import ChangePasswordModal from './component/ChangePasswordModal';
import InputFile from '~/components/Input/InputFile';
import { UserController } from '~/controller';
import { NotificationTheme } from '../layout';
import { NotificationType } from '~/components/Notification';

export default function Page({ params: { userUuid } }: { params: { userUuid: string } }) {
    const { fileBuffers, setAddFile } = useFile();
    const { data: profile, isSuccess, refetch } = useProfile();
    const [userData, setUserData] = useState({
        name: '',
        avatarBuffer: '',
        age: 0,
    });
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const notificationShow = useContext(NotificationTheme);
    const debounceName = useDebounce(userData.name, 500);
    const debounceAge = useDebounce(userData.age.toString(), 500);

    useEffect(() => {
        if (isSuccess) {
            setUserData({
                name: profile.name,
                avatarBuffer: '',
                age: parseInt(profile.age),
            });
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isSuccess) {
            if (
                (debounceName && debounceName !== profile.name) ||
                (debounceAge && debounceAge !== profile.age.toString())
            )
                handleSubmit();
        }
    }, [debounceName, debounceAge]);

    useEffect(() => {
        if (fileBuffers.length > 0) {
            handleSubmit();
        }
    }, [fileBuffers]);

    const handleSubmit = async () => {
        const userController = new UserController();

        const res = await userController.updateProfile({
            name: userData.name,
            age: userData.age,
            file: fileBuffers.length > 0 ? fileBuffers[0] : undefined,
        });

        if (!res.error) {
            notificationShow('Cập nhật thông tin thành công', NotificationType.success);
            refetch();
        } else notificationShow(res.error, NotificationType.success);
    };

    return isSuccess ? (
        <div className="flex p-[64px] gap-[32px] h-screen">
            <div className="w-[300px] h-[300px] bg-white shadow-custom-5 rounded-full flex justify-center items-center relative">
                <div className="rounded-full overflow-hidden shadow-custom-3">
                    <Image
                        className=""
                        src={
                            profile.avatar !== null
                                ? profile.avatar
                                : profile.role === 'TEACHER'
                                  ? image.teacher
                                  : image.student
                        }
                        width={200}
                        height={200}
                        alt="avatar"
                    />
                    <div className="absolute bottom-[50px] right-[50px] cursor-pointer">
                        <InputFile onChange={setAddFile}>
                            <div className="bg-blue-400 w-[50px] h-[50px] rounded-full shadow-custom-1 flex items-center justify-center">
                                <FontAwesomeIcon icon={faPen} className="text-white text-[24px]" />
                            </div>
                        </InputFile>
                    </div>
                </div>
            </div>

            <div className="w-[300px] bg-white h-full shadow-custom-5 rounded-xl grow flex justify-around text-[20px] px-[64px] py-[32px]">
                <div className="flex flex-col items-center gap-[64px] my-[64px]">
                    <div>
                        <div className="mb-[8px] font-bold">Tên: </div>
                        <Input
                            value={userData.name}
                            classNameWrapper="rounded-lg shadow-none border-2 w-[300px]"
                            className="text-[18px]"
                            onChange={(value) => {
                                setUserData({ ...userData, name: value });
                            }}
                        />
                    </div>
                    <div className="w-[300px]">
                        <div className="mb-[8px] font-bold">Vai trò: </div>
                        <div className="rounded-lg shadow-none border-2 p-[15px] pr-[18px] text-[18px] w-full">
                            {profile.role === 'TEACHER' ? 'Giáo viên' : 'Học sinh'}
                        </div>
                    </div>
                    <div className="w-[300px]">
                        <div className="mb-[8px] font-bold">Tham gia ngày: </div>
                        <div className="rounded-lg shadow-none border-2 p-[15px] pr-[18px] text-[18px] w-full">
                            {profile.createAt}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-[64px] my-[64px]">
                    <div className="min-w-[300px]">
                        <div className="mb-[8px] font-bold">Email: </div>
                        <div className="rounded-lg shadow-none border-2 p-[15px] pr-[18px] text-[18px] w-full">
                            {profile.email}
                        </div>
                    </div>
                    <div className="w-[300px]">
                        <div className="mb-[8px] font-bold">Tuổi: </div>
                        <Input
                            value={userData.age.toString()}
                            inputType="number"
                            classNameWrapper="rounded-lg shadow-none border-2 w-[300px]"
                            className="text-[18px]"
                            onChange={(value) => {
                                setUserData({ ...userData, age: parseInt(value) });
                            }}
                        />
                    </div>
                    <div className="w-[300px]">
                        <div className="mb-[8px] font-bold">Mật khẩu: </div>
                        <Button
                            theme="fill"
                            className="rounded-lg w-full"
                            size="big"
                            handleClick={() => setOpenChangePassword(true)}
                        >
                            Thay đổi mật khẩu
                        </Button>
                    </div>
                </div>
            </div>
            {openChangePassword && <ChangePasswordModal handleCloseModal={() => setOpenChangePassword(false)} />}
        </div>
    ) : (
        <Loading />
    );
}
