'use client';

import testData from './testData.json';
import MemberScoreCard from './components/MemberScoreCard';
import Selection from '~/components/Selection';

export default function page() {
    return (
        <div className="flex flex-col gap-[16px]">
            <div className="flex justify-center">
                <div className="w-[80%] flex items-center gap-[16px]">
                    <div>
                        <Selection
                            className="bg-black/50 rounded-lg cursor-pointer text-white w-fit"
                            optionData={['Tăng dần', 'Giảm dần']}
                            label="Sắp xếp"
                            onChange={() => {}}
                        />
                    </div>
                    <div>
                        <Selection
                            className="w-fit bg-black/50 rounded-lg cursor-pointer text-white"
                            optionData={['Đúng hạn', 'Trễ hạn']}
                            label="Thời gian nộp"
                            onChange={() => {}}
                        />
                    </div>
                    <div>
                        <Selection
                            className="bg-black/50 rounded-lg cursor-pointer text-white w-fit"
                            optionData={['Đã nộp', 'Chưa nộp']}
                            label="Tình trạng"
                            onChange={() => {}}
                        />
                    </div>
                </div>
            </div>
            {testData.map((item, index) => (
                <MemberScoreCard key={index} infor={item} />
            ))}
        </div>
    );
}
