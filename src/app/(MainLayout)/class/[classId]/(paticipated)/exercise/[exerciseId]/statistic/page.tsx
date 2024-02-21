'use client';

import BarChart from '~/components/BarChart';

const data = ['50', '20', '40', '30', '20', '60', '80', '90', '100', '95', '70', '75'];

export default function page() {
    return (
        <div>
            <BarChart
                name="Điểm bài tập"
                data={{
                    labels: ['< 50', '50 - 80', '80 - 100'],
                    datasets: [
                        {
                            label: 'Điểm',
                            data: [
                                data.filter((item) => parseInt(item) < 50).length,
                                data.filter((item) => parseInt(item) >= 50 && parseInt(item) < 80).length,
                                data.filter((item) => parseInt(item) >= 80 && parseInt(item) <= 100).length,
                            ],
                            backgroundColor: ['rgb(248 113 113)', 'rgb(250 204 21)', 'rgb(163 230 53)'],
                            width: '32px',
                        },
                    ],
                }}
            />
        </div>
    );
}
