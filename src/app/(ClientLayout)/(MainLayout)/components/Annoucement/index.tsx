import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import testData from './testData.json';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Announcenment() {
    return (
        <div className="h-fit max-h-screen w-[400px] flex flex-col gap-[16px] pl-[16px]">
            {testData.map((announcement, index) => (
                <Link
                    href={announcement.from}
                    key={index}
                    className="bg-white pl-[12px] pr-[32px] py-[16px] shadow-custom-4 rounded-2xl relative"
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="absolute right-[8px] top-[8px] cursor-pointer text-[24px]"
                    />
                    <div className="flex justify-between items-end mb-[16px]">
                        <div className="font-bold text-[20px]">{announcement.title}</div>
                        <div className="text-slate-400">
                            {announcement.sendIn.time}, {announcement.sendIn.date}
                        </div>
                    </div>
                    <div className="text-slate-500 px-[4px]">{announcement.message}</div>
                </Link>
            ))}
        </div>
    );
}
