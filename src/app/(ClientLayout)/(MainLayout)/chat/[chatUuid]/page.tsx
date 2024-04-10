'use client';

import { RawDraftContentState } from 'draft-js';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import Image from 'next/image';

import TextEditor from '~/components/TextEditor';
import image from '~/assets/image';
import SimpleBarReact from 'simplebar-react';
import useChatHistory from '~/hooks/useChatHistory';
import Loading from '~/components/Loading';
import { ChatController } from '~/controller';
import { useProfile } from '~/hooks';

export default function page({ params }: { params: { chatUuid: string } }) {
    const { data: chatHistory, isSuccess: isChatHistorySuccess, refetch } = useChatHistory(params.chatUuid);
    const { data: profile } = useProfile();
    const [message, setMessage] = useState<null | RawDraftContentState>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isChatHistorySuccess) {
            const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                socket.on(`${chatHistory.uuid}/newMessage`, () => {
                    refetch();
                });
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [isChatHistorySuccess]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSendMessage = async (message: RawDraftContentState | null) => {
        const chatController = new ChatController();

        if (message) {
            const res = await chatController.sendMessage(chatHistory.uuid, JSON.stringify(message));

            if (!res.error) {
                setMessage(null);
                refetch();
            }
        }
    };

    return isChatHistorySuccess ? (
        <div className="w-full flex flex-col h-screen justify-end pb-[32px] relative">
            <div className="bg-white h-[80px] w-full absolute top-0 border-b-2 border-slate-200 flex items-center justify-center">
                <div className="flex flex-col justify-center items-center relative">
                    <Image
                        alt="avatar"
                        src={
                            chatHistory.avatar !== null
                                ? chatHistory.avatar
                                : chatHistory.role === 'TEACHER'
                                  ? image.teacher
                                  : image.student
                        }
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div className="font-bold text-[18px]">{chatHistory.name}</div>
                </div>
            </div>

            {chatHistory.message.length > 0 ? (
                <SimpleBarReact
                    forceVisible="y"
                    scrollableNodeProps={{ ref: scrollRef }}
                    style={{
                        minHeight: 0,
                        flexGrow: '1',
                        padding: '16px 32px 16px',
                        marginTop: '80px',
                    }}
                >
                    <div className="flex flex-col gap-[16px]">
                        {chatHistory.message.map((message: any) => (
                            <div
                                className={`flex items-end ${message.fromUserUuid === profile.uuid ? 'justify-end' : 'justify-start'}`}
                                key={message.uuid}
                            >
                                <div
                                    className={`flex flex-col ${message.fromUserUuid === profile.uuid ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`px-[8px] py-[8px] w-fit max-w-[250px] rounded-lg ${message.fromUserUuid === profile.uuid ? 'bg-blue-500 text-white' : 'bg-slate-300 text-black'}`}
                                    >
                                        <TextEditor
                                            editable={false}
                                            rawContentState={JSON.parse(message.content)}
                                            label=""
                                        />
                                    </div>
                                    <div className="text-slate-400 mt-[8px] ml-[4px]">
                                        {message.sendIn.time}, {message.sendIn.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SimpleBarReact>
            ) : (
                <div className="h-full flex justify-center items-center text-slate-400 text-[24px]">
                    Hãy gửi tin nhắn đến bạn bè
                </div>
            )}

            <div className="flex items-center mt-[8px]">
                <div style={{ width: 'calc(100vw - 450px)' }}>
                    <TextEditor
                        key={Math.random()}
                        className="w-full"
                        editable={true}
                        isToolboxOffetStype={false}
                        isToolboxType={false}
                        rawContentState={message}
                        pressEnter={(content) => handleSendMessage(content)}
                        onChange={setMessage}
                        label=""
                    />
                </div>
                <div
                    onClick={() => handleSendMessage(message)}
                    className="absolute right-[32px] bg-[white] shadow-custom-1 px-[12px] py-[4px] rounded-full flex items-center justify-center text-[32px] mt-[12px] ml-[16px] cursor-pointer"
                >
                    <FontAwesomeIcon icon={faCaretRight} className="" />
                </div>
            </div>
        </div>
    ) : (
        <Loading />
    );
}
