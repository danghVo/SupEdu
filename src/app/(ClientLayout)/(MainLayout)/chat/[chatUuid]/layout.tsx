import { ChatController } from '~/controller/chat.controller';

export async function generateStaticParams() {
    const chatController = new ChatController();

    const data = await chatController.getAllChatAvail();

    if (data?.error) {
        return [];
    } else {
        const chatAvails = data;

        return chatAvails.map((chatAvails: { uuid: string }) => ({
            chatUuid: chatAvails.uuid,
        }));
    }
}

export default function layout({
    children,
    params: { chatUuid },
}: {
    children: React.ReactNode;
    params: { chatUuid: string };
}) {
    return <div className="grow">{children}</div>;
}
