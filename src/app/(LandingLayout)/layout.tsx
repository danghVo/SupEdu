import Header from './components/Header';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={'min-h-[100vh] bg-main overflow-x-hidden'}>
            <Header />
            <div>{children}</div>
        </div>
    );
}
