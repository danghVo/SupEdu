import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import '~/styles/globals.css';
import 'simplebar-react/dist/simplebar.min.css';
import 'draft-js/dist/Draft.css';

config.autoAddCss = true;

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'SupEdu',
    
    description: 'Support Education System',
    icons: "/image/icon.png",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className} suppressHydrationWarning>
                {children}
                <div id="modal-root"></div>
            </body>
        </html>
    );
}
