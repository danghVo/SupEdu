export async function generateStaticParams() {
    return [
        {
            chatId: '0',
        },
        {
            chatId: '1',
        },
    ];
}

export default function layout({
    children,
    params: { chatId },
}: {
    children: React.ReactNode;
    params: { chatId: string };
}) {
    return <div className="grow">{children}</div>;
}
