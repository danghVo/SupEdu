export function generateStaticParams() {
    // fetch class data

    return [{ classId: '1' }, { classId: '2' }, { classId: '3' }];
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
