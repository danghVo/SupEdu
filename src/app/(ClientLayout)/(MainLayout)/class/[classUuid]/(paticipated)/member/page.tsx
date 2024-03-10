'use client';

import Image from 'next/image';
import testData from './testData.json';
import image from '~/assets/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import AddMember from './components/AddMember';
import InputOption from '~/components/Input/InputOption';
import { useScroll } from 'framer-motion';
import { useState } from 'react';
import Selection from '~/components/Selection';
import Search from '~/components/Search';
import MemberCard from '../components/MemberCard';

export default function Member({ params }: { params: { classId: string } }) {
    const [maxMember, setMaxMember] = useState('20');

    const handleSetMaxNumber = (member: string) => {
        setMaxMember(maxMember);
    };

    return (
        <div className="mt-[-16px]">
            <AddMember link="http://localhost:3000/class/0" />
            <div className="flex justify-center mb-[24px] rounded-lg">
                <div className="w-[80%] flex items-center justify-between">
                    <div>
                        <span className="font-semibold mr-[16px] text-[18px]">Số thành viên:</span>3
                    </div>
                    <div>
                        <Search handleSearch={() => {}} />
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold mr-[16px] text-[18px]">Số thành viên tối đa: </span>
                        <Selection
                            className="w-[60px] bg-white rounded-lg flex justify-center shadow-custom-4"
                            defaultSelection={maxMember}
                            optionData={['20', '40', '60']}
                            onChange={handleSetMaxNumber}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-[16px]">
                {testData.map((infor, index) => (
                    <MemberCard
                        key={index}
                        infor={infor}
                        actionsElement={
                            <>
                                <div className="text-[24px] cursor-pointer">
                                    <FontAwesomeIcon icon={faComment} />
                                </div>
                                <div className="text-[24px] cursor-pointer">
                                    <FontAwesomeIcon icon={faUserMinus} />
                                </div>
                            </>
                        }
                    />
                ))}
            </div>
        </div>
    );
}
