import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';

import Button from '~/components/Button';
import { PostController } from '~/controller';
import { useClass, useVote } from '~/hooks';
import checkTimeExprire from '~/components/TextEditor/utils/checkTimeExpire';
import { TimeData } from '~/constant';

interface VoteItem {
    uuid?: string;
    value: string;
}

export interface VoteData {
    uuid?: string;
    options: Array<VoteItem>;
}

export default function Vote({
    expireTime = undefined,
    classUuid,
    edit,
    voteData,
    onChange,
    error,
    onError = (error: string) => {},
}: {
    expireTime?: TimeData | undefined;
    classUuid: string;
    edit: boolean;
    error: string;
    onError: (error: string) => void;
    voteData: VoteData | null;
    onChange: (voteDate: VoteData) => void;
}) {
    const [options, setOptions] = useState<Array<VoteItem>>([{ value: '' }, { value: '' }]);
    const { data: voteChosen, isSuccess, isRefetching, refetch } = useVote(voteData?.uuid);
    const { data: classData, isSuccess: isClassSuccess } = useClass(classUuid);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (voteData) {
            setOptions(voteData.options);
        }
    }, []);

    useEffect(() => {
        if (voteData?.uuid) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                socket.on(`${voteData.uuid}`, () => {
                    refetch!();
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [voteData?.uuid]);

    useEffect(() => {
        if (edit) {
            onChange({
                uuid: voteData?.uuid,
                options,
            });
        }
    }, [options]);

    const handleChangeOption = (e: any, index: number) => {
        const value = e.target.value;

        if (options.find((item) => item.value === value)) {
            onError('Không được có lựa chọn trùng nhau');
        } else if (error) {
            onError('');
        }

        options[index] = {
            value,
            uuid: undefined,
        };

        setOptions([...options]);
    };

    const hanldeAddNewOption = () => {
        setOptions((prev) => [...prev, { value: '' }]);
    };

    const handleRemoveOption = (removedIndex: number) => {
        if (options.length > 2) {
            setOptions((prev) => prev.filter((item, index) => index !== removedIndex));
        } else {
            onError('Không được có ít hơn 2 lựa chọn');
        }
    };

    const handleChooseOption = async (option: VoteItem) => {
        if (
            !edit &&
            isClassSuccess &&
            !classData.isOwner &&
            expireTime &&
            !checkTimeExprire(expireTime.time, expireTime.date)
        ) {
            if (voteData?.uuid && option.uuid) {
                const postController = new PostController();

                const res = await queryClient.fetchQuery({
                    queryKey: ['vote'],
                    queryFn: () => postController.vote(voteData.uuid!, option.uuid!),
                });

                if (!res.error && refetch) {
                    refetch();
                }
            }
        }
    };

    const handleClear = () => {
        setOptions(Array(2).fill({ value: '' }));
    };

    const handleRemoveSelection = async () => {
        if (!edit && !classData.isOwner && expireTime && !checkTimeExprire(expireTime.time, expireTime.date)) {
            if (voteData?.uuid) {
                const postController = new PostController();

                const res = await queryClient.fetchQuery({
                    queryKey: ['vote'],
                    queryFn: () => postController.removeVote(voteData.uuid!),
                });

                if (!res.error && refetch) {
                    refetch();
                }
            }
        }
    };

    return (
        <div className="my-[16px] mx-[32px]">
            {edit && <div className="font-semibold text-[18px] mb-[16px]">Bình chọn:</div>}
            {error && (
                <div className="text-red-600 my-[12px] mx-[12px] flex justify-between items-center  ">
                    {error}
                    <FontAwesomeIcon icon={faXmark} onClick={() => onError('')} className="mr-[16px] cursor-pointer" />
                </div>
            )}
            {!edit && (
                <div className="flex items-center justify-between">
                    {voteChosen?.choose && (
                        <div
                            className="underline mr-[16px] font-semibold cursor-pointer"
                            onClick={handleRemoveSelection}
                        >
                            Bỏ lựa chọn
                        </div>
                    )}
                </div>
            )}
            <div className="mx-[16px] my-[12px]">
                {options.map((option, index) => (
                    <div key={index}>
                        <motion.div
                            className={`px-[12px] my-[16px] shadow-custom-4 rounded-full overflow-hidden flex items-center`}
                            initial={{ border: '0px solid transparent' }}
                            animate={
                                voteChosen?.choose === option?.uuid && !edit
                                    ? { border: '2px solid green' }
                                    : { border: '0px solid transparent' }
                            }
                            onClick={() => handleChooseOption(option)}
                        >
                            {expireTime &&
                                !checkTimeExprire(expireTime.time, expireTime.date) &&
                                !classData.isOwner && (
                                    <div
                                        className={`cursor-pointer h-[16px] flex items-center ${
                                            voteChosen?.choose === option?.uuid && !edit
                                                ? 'relative before:content-[""] before:block before:absolute before:top-0 before:w-full before:h-full before:bg-green-500 before:rounded-full'
                                                : ''
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={faCircle} />
                                    </div>
                                )}
                            <input
                                className={`px-[8px] py-[8px] w-full outline-none ${!edit ? 'cursor-pointer' : ''}`}
                                placeholder={`Lựa chọn ${index + 1}`}
                                value={option.value}
                                readOnly={!edit}
                                onChange={(e) => handleChangeOption(e, index)}
                            />
                            {edit && (
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="cursor-pointer px-[4px]"
                                    onClick={() => handleRemoveOption(index)}
                                />
                            )}
                        </motion.div>

                        {!edit && isSuccess && (voteChosen?.choose || (classData.isOwner && voteChosen)) && (
                            <div className="flex items-center gap-[16px] px-[8px]">
                                <motion.div
                                    className={`h-[20px] ${voteChosen?.choose === option.uuid ? 'bg-green-500' : 'bg-black'} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${voteChosen.options[option.uuid!] || 0}%` }}
                                ></motion.div>
                                <span className="font-semibold">{voteChosen.options[option.uuid!] || 0}%</span>
                            </div>
                        )}
                    </div>
                ))}

                {edit && (
                    <div
                        className="px-[12px] py-[8px] my-[16px] shadow-custom-4 rounded-full overflow-hidden flex items-center cursor-pointer"
                        onClick={hanldeAddNewOption}
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-[8px]" />
                        Thêm lựa chọn
                    </div>
                )}
            </div>

            {edit && (
                <div className="mt-[24px] flex items-center gap-[12px] justify-end">
                    <Button className="border-slate-400 border-2 w-[80px]" handleClick={handleClear}>
                        Reset
                    </Button>
                </div>
            )}
        </div>
    );
}
