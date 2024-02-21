import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ name, data, options = {} }: { name: string; data: any; options?: any }) {
    return (
        <Bar
            data={data}
            options={{
                responsive: true,
                indexAxis: 'y' as const,
                elements: {
                    bar: {
                        borderRadius: 999,
                        borderSkipped: 'start',
                        // borderCapStyle: 'round',
                        borderWidth: 32,
                        borderColor: 'rgba(255, 255, 255, 0)',
                    },
                },
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: name,
                        font: {
                            size: 32,
                        },
                        color: 'black',
                    },
                },
                ...options,
            }}
        />
    );
}
