'use client';

import { useEffect, useState } from 'react';

import MemberScoreCard from './components/MemberScoreCard';
import Selection from '~/components/Selection';
import checkTimeExprire from '~/components/TextEditor/utils/checkTimeExpire';
import { useClass, useExercise, useSubmits } from '~/hooks';

export default function Page({
    params: { classUuid, exerciseId },
}: {
    params: { classUuid: string; exerciseId: string };
}) {
    const { data: submits, isSuccess: isSubmitsSuccess, isRefetching, refetch } = useSubmits(exerciseId);
    const { data: exercise, isSuccess: isExerciseSuccess } = useExercise(exerciseId);
    const { data: classData, isSuccess: isClassSuccess } = useClass(classUuid);
    const [submitsShow, setSubmitsShow] = useState<any[] | null>(null);
    const [currentFilter, setCurrentFilter] = useState<{ status: string; time: string; arrange: string }>({
        status: '',
        time: '',
        arrange: '',
    });

    useEffect(() => {
        if (isSubmitsSuccess && !isRefetching) {
            if (!submits.error) {
                setSubmitsShow(submits.filter((submit: any) => submit.timeAssign.date));
            } else setSubmitsShow([]);
        }
    }, [isSubmitsSuccess, isRefetching]);

    useEffect(() => {
        let submitsFilter = [];

        if (currentFilter.status === 'Tất cả') {
            submitsFilter = submits;
        } else if (currentFilter.status === 'Đã nộp') {
            submitsFilter = submits.filter((submit: any) => submit.timeAssign.date);
        } else if (currentFilter.status === 'Chưa nộp') {
            const notSubmit = submits.filter((submit: any) => submit.timeAssign.date === null);
            submitsFilter = notSubmit;
        }

        if (currentFilter.time === 'Đúng hạn') {
            submitsFilter = submitsFilter.filter((submit: any) => submit.status === 'ONTIME');
        } else if (currentFilter.time === 'Trễ hạn') {
            submitsFilter = submitsFilter.filter((submit: any) => submit.status === 'LATE');
        }

        if (submitsFilter.length >= 2) {
            if (currentFilter.arrange === 'Tăng dần') {
                submitsFilter = submitsFilter.sort((a: any, b: any) => a.score - b.score);
            } else if (currentFilter.arrange === 'Giảm dần') {
                submitsFilter = submitsFilter.sort((a: any, b: any) => b.score - a.score);
            }
        }

        setSubmitsShow(submitsFilter);
    }, [currentFilter, submits]);

    const handleFilterScore = (selection: string) => {
        setCurrentFilter((prev) => ({
            ...prev,
            arrange: selection,
        }));
    };

    const handleFilterTime = (selection: string) => {
        setCurrentFilter((prev) => ({
            ...prev,
            time: selection,
        }));
    };

    const handleFilterAssign = (selection: string) => {
        setCurrentFilter((prev) => ({
            ...prev,
            status: selection,
        }));
    };

    return (
        <div className="flex flex-col gap-[16px]">
            <div className="flex justify-center">
                <div className="w-[80%] flex items-center gap-[16px]">
                    {isSubmitsSuccess && isExerciseSuccess && isClassSuccess && (
                        <>
                            <></>
                            <div>
                                <Selection
                                    className="bg-black rounded-lg cursor-pointer text-white w-fit"
                                    optionData={['Tất cả', 'Đã nộp', 'Chưa nộp']}
                                    defaultSelection={
                                        checkTimeExprire(exercise.timeTaskEnd.time, exercise.timeTaskEnd.date)
                                            ? 'Tất cả'
                                            : 'Đã nộp'
                                    }
                                    label="Trạng thái"
                                    onChange={handleFilterAssign}
                                />
                            </div>
                            <div className="h-full w-[6px] rounded-lg bg-black"></div>
                            <div>
                                <Selection
                                    className={`${currentFilter.status === 'Chưa nộp' || currentFilter.status === 'Tất cả' ? 'bg-black opacity-[0.5]' : 'bg-black'} w-fit bg-black rounded-lg cursor-pointer text-white`}
                                    optionData={['Đúng hạn', 'Trễ hạn']}
                                    label="Thời gian nộp"
                                    disable={currentFilter.status === 'Chưa nộp' || currentFilter.status === 'Tất cả'}
                                    onChange={handleFilterTime}
                                />
                            </div>
                            <div>
                                <Selection
                                    className={`${(submitsShow && submitsShow.length < 2) || currentFilter.status === 'Chưa nộp' ? 'bg-black opacity-[0.5]' : 'bg-black'} rounded-lg cursor-pointer text-white w-fit`}
                                    optionData={['Tăng dần', 'Giảm dần']}
                                    label="Sắp xếp"
                                    disable={
                                        (submitsShow && submitsShow.length < 2) || currentFilter.status === 'Chưa nộp'
                                    }
                                    onChange={handleFilterScore}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {submitsShow &&
                (submitsShow.length === 0 ? (
                    <div style={{ color: classData.textColor }} className="text-[24px] font-bold text-center mt-[24px]">
                        Không có thành viên phù hợp
                    </div>
                ) : (
                    submitsShow.map((item: any) => (
                        <MemberScoreCard
                            classUuid={classUuid}
                            refetch={refetch}
                            submitUuid={item.uuid}
                            key={item.uuid}
                            infor={item}
                        />
                    ))
                ))}
        </div>
    );
}
