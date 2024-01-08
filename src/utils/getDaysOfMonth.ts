interface datesOfMonth
    extends Array<{
        day: number;
        date: number;
        month: number;
    }> {}

export default function getDaysOfMonth(month: number, year: number) {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const days = new Array(lastDayOfMonth.getDate());
    const dayList = new Array(7).fill(0);

    let prevDay = {
        day: firstDayOfMonth.getDay(),
        date: firstDayOfMonth.getDate(),
        month,
    };

    let datesOfMonth = days.fill(0).map((item, index) => {
        if (index !== 0) {
            prevDay = {
                day: prevDay.day === 6 ? 0 : prevDay.day + 1,
                date: prevDay.date + 1,
                month,
            };
        }

        return prevDay;
    });

    if (firstDayOfMonth.getDay() > 0) {
        datesOfMonth = fillPreDayList(new Date(year, month, 0), datesOfMonth);
    }
    if (lastDayOfMonth.getDay() < 6) {
        datesOfMonth = fillPostDayList(new Date(year, month + 1, 1), datesOfMonth);
    }

    return dayList.map((day, index) => {
        return {
            day: index,
            dates: datesOfMonth.filter((date) => date.day === index),
        };
    });
}

const fillPreDayList = (lastDayOfPrevMonth: Date, datesOfMonth: datesOfMonth) => {
    const month = lastDayOfPrevMonth.getMonth();
    let tempDay = {
        day: lastDayOfPrevMonth.getDay(),
        date: lastDayOfPrevMonth.getDate(),
        month,
    };

    while (tempDay.day >= 0) {
        datesOfMonth.unshift(tempDay);
        tempDay = { day: tempDay.day - 1, date: tempDay.date - 1, month };
    }

    return datesOfMonth;
};

const fillPostDayList = (firstDayOfNextMonth: Date, datesOfMonth: datesOfMonth) => {
    const month = firstDayOfNextMonth.getMonth();
    let tempDay = {
        day: firstDayOfNextMonth.getDay(),
        date: firstDayOfNextMonth.getDate(),
        month,
    };

    while (tempDay.day <= 6) {
        datesOfMonth.push(tempDay);
        tempDay = { day: tempDay.day + 1, date: tempDay.date + 1, month };
    }

    return datesOfMonth;
};
