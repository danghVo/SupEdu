'use client';

import BarChart from '~/components/BarChart';

import { useClass } from '~/hooks';
import useSubmits from '~/hooks/useSubmits';

export default function page({
    params: { classUuid, exerciseId },
}: {
    params: { classUuid: string; exerciseId: string };
}) {
    const { data: submits, isSuccess } = useSubmits(exerciseId);
    const { data: classData, isSuccess: isClassSuccess } = useClass(classUuid);
    let score = [];

    if (isSuccess) {
        score = submits.filter((submit: any) => submit.isMarked).map((item: any) => item.score);
    }

    return (
        isSuccess &&
        isClassSuccess && (
            <div>
                {score.length > 0 ? (
                    <BarChart
                        name="Điểm bài tập"
                        data={{
                            labels: ['< 50', '50 - 80', '80 - 100'],
                            datasets: [
                                {
                                    label: 'Điểm',
                                    data: [
                                        score.filter((score: number) => score < 50).length,
                                        score.filter((score: number) => score >= 50 && score < 80).length,
                                        score.filter((score: number) => score >= 80 && score <= 100).length,
                                    ],
                                    backgroundColor: ['rgb(248 113 113)', 'rgb(250 204 21)', 'rgb(163 230 53)'],
                                    width: '32px',
                                },
                            ],
                        }}
                    />
                ) : (
                    <div style={{ color: classData.textColor }} className="text-[24px] font-bold text-center mt-[24px]">
                        Không có dữ liệu
                    </div>
                )}
            </div>
        )
    );
}
