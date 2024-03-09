'use client';

import { RawDraftContentState } from 'draft-js';
import testData from './testData.json';
import TextEditor from '~/components/TextEditor';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import student from '~/assets/image/student.png';
import SimpleBarReact from 'simplebar-react';
import Input from '~/components/Input';

export default function page({ params: { chatId } }: { params: { chatId: string } }) {
    const [message, setMessage] = useState<null | RawDraftContentState>(null);

    const sendMessageWrapperRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    return (
        <div className="w-full flex flex-col h-screen justify-end pb-[32px] relative">
            <div className="bg-white h-[80px] w-full absolute top-0 border-b-2 border-slate-200 flex items-center justify-center">
                <div className="flex flex-col justify-center items-center relative">
                    <Image alt="avatar" src={student} className="w-[40px] h-[40px] rounded-full" />
                    <div className="font-bold text-[18px]">Student A</div>
                    <div className="text-slate-400 absolute left-[16px]">
                        <FontAwesomeIcon icon={faCircle} className={'text-green-400'} />
                    </div>
                </div>
            </div>

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
                    {testData.messages.map((message, index) => (
                        <div className={`flex items-end ${message.isMe ? 'justify-end' : 'justify-start'}`} key={index}>
                            <div className={`flex flex-col ${message.isMe ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-[8px] py-[12px] w-fit max-w-[250px] rounded-full ${message.isMe ? 'bg-blue-500 text-white' : 'bg-slate-300 text-black'}`}
                                >
                                    <TextEditor editable={false} rawContentState={message.message} label="" />
                                </div>
                                <div className="text-slate-400 mt-[8px] ml-[4px]">
                                    {message.sendIn.time}, {message.sendIn.date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </SimpleBarReact>

            <div className="flex items-center mt-[8px]" ref={sendMessageWrapperRef}>
                <div style={{ width: 'calc(100vw - 450px)' }}>
                    <TextEditor
                        className="w-full"
                        editable={true}
                        isToolboxOffetStype={false}
                        isToolboxType={false}
                        rawContentState={message}
                        onChange={setMessage}
                        label=""
                    />
                </div>
                <FontAwesomeIcon icon={faCaretRight} className="text-[32px] mt-[12px] ml-[16px]" />
            </div>
        </div>
    );
}
