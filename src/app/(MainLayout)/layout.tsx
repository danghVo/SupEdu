import '~/styles/globals.scss';
import Header from './components/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={'bg-main overflow-x-hidden'}>
            <Header />
            <div>{children}</div>
        </div>
    );
}
