import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops), var(--tw-gradient-to))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                main: 'linear-gradient(to bottom, transparent, rgb(var(--background-end-rgb)))',
                logging: 'linear-gradient(140deg, #56ab2f, #a8e063)',
            },
            backgroundColor: {
                main: 'rgb(var(--background-start-rgb))',
                // 'main-inner':
            },
            boxShadow: {
                'custom-1': 'rgba(0, 0, 0, 0.35) 0px 5px 15px;',
                'custom-2': 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
            },
        },
    },
    plugins: [],
};
export default config;
