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
                logging: 'linear-gradient(140deg, #A9D2FD , #e4f1ff 50%)',
            },
            backgroundColor: {
                main: 'rgb(var(--background-start-rgb))',
                class: 'rgb(var(--background-start-rgb))',
            },
            boxShadow: {
                'custom-1': 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                'custom-2': 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                'custom-3': 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                'custom-4': 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                'custom-5': 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
            },
            animation: {
                loading: 'loading 5s linear infinite',
            },
            keyframes: {
                loading: {
                    '0%': { left: '0' },
                    '100%': { left: '100%' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
