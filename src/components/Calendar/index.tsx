'use client';

import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { day, month } from '~/constant';
import getDaysOfMonth from '~/utils/getDaysOfMonth';

const today = new Date();

export default function Calendar({
    value,
    markedDays,
    handleClickDay,
}: {
    value?: string;
    markedDays?: Array<string>;
    handleClickDay?: (date: string | null) => void;
}) {
    const [currentDate, setCurrentDate] = useState<{ month: number; date: number | null; year: number }>({
        date: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
    });
    const [dateSelected, setDaySelected] = useState<string | null>(
        value ? value.slice(0, value.length - 5) : `${today.getDate()}/${today.getMonth() + 1}`,
    );

    useEffect(() => {
        if (value) {
            const dateArray = value.split('/');

            setCurrentDate({
                month: parseInt(dateArray[1]) - 1,
                date: parseInt(dateArray[0]),
                year: parseInt(dateArray[2]),
            });
        }
    }, []);

    useEffect(() => {
        if (handleClickDay) {
            if (dateSelected) {
                handleClickDay(dateSelected + `/${currentDate.year}`);
            } else handleClickDay(null);
        }
    }, [dateSelected]);

    const daysOfMonth = getDaysOfMonth(currentDate.month, currentDate.year);

    const handleChangeMonth = (month: number, year: number) => {
        if (month === today.getMonth() && year === today.getFullYear()) {
            setCurrentDate({ month, date: today.getDate(), year });
        } else if (month >= 0 && month <= 11) {
            setCurrentDate((prev) => ({ ...prev, month, date: null }));
        } else {
            const yearSetted = month === -1 ? year + -1 : year + 1;

            setCurrentDate((prev) => ({
                ...prev,
                month: month === -1 ? 11 : 0,
                date: yearSetted === today.getFullYear() ? today.getDate() : null,
                year: yearSetted,
            }));
        }

        setDaySelected(null);
    };

    const hanldeChooseDay = (date: number, month: number) => {
        if (month !== currentDate.month) {
            setCurrentDate((prev) => ({
                ...prev,
                month,
            }));
        }
        setDaySelected(`${date}/${month + 1}`);
    };

    const markedDate = (fullDateString: string) => {
        if (markedDays) {
            if (markedDays.includes(fullDateString)) {
                return Date.parse(fullDateString) > Date.now() ? 'bg-slate-400 text-white' : 'bg-slate-800 text-white';
            }
        } else return '';
    };

    return (
        <div className="w-full font-bold my-[24px]">
            <div className="text-center mb-[24px] flex justify-around items-center ">
                <FontAwesomeIcon
                    onClick={() => handleChangeMonth(currentDate.month - 1, currentDate.year)}
                    className="text-[24px] cursor-pointer px-[12px]"
                    icon={faCaretLeft}
                />
                <div className="cursor-pointer">
                    {month[currentDate.month]} / {currentDate.year}
                </div>
                <FontAwesomeIcon
                    onClick={() => handleChangeMonth(currentDate.month + 1, currentDate.year)}
                    className="text-[24px] cursor-pointer px-[12px]"
                    icon={faCaretRight}
                />
            </div>

            <div className="flex  justify-between px-[16px]">
                {day.map((item, index) => (
                    <div key={index} className="flex flex-col items-center justift-start">
                        <div className="font-semibold mb-[24px]">{item}</div>
                        <div className="flex flex-col justify-between gap-x-[4px] gap-y-[8px] items-center">
                            {daysOfMonth[index].dates.map((dateItem) => (
                                <div
                                    onClick={() => hanldeChooseDay(dateItem.date, dateItem.month)}
                                    key={dateItem.date}
                                    className={`font-normal text-[14px] flex items-center justify-center w-[25px] h-[25px] px-[8px] py-[0px] cursor-pointer rounded-full relative ${
                                        today.getDate() === dateItem.date &&
                                        today.getMonth() === dateItem.month &&
                                        today.getFullYear() === currentDate.year
                                            ? 'bg-black text-white rounded-full'
                                            : ''
                                    } ${currentDate.month === dateItem.month ? '' : 'text-slate-200'} ${markedDate(
                                        `${dateItem.date}/${dateItem.month + 1}/${currentDate.year}`,
                                    )}`}
                                >
                                    {dateSelected === `${dateItem.date}/${dateItem.month + 1}` && (
                                        <div
                                            className={`w-[100%] h-[100%] border-[3px] border-white absolute outline outline-slate-400 top-0 bottom-0 right-0 left-0 rounded-full`}
                                        ></div>
                                    )}
                                    {dateItem.date}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
