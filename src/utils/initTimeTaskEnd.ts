export default function initTimeTaskEnd() {
    const currentDay = new Date();
    const lastDayOfCurrentMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0);
    let currentMonth = currentDay.getMonth() + 1;
    let currentYear = currentDay.getFullYear();
    const currentDate = currentDay.getDate() === lastDayOfCurrentMonth.getDate() ? 1 : currentDay.getDate() + 1;
    if (currentDay.getDate() === lastDayOfCurrentMonth.getDate()) {
        currentMonth = currentDay.getMonth() + 2;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear = currentDay.getFullYear() + 1;
        }
    }

    return {
        date: `${currentDate < 9 ? '0' : ''}${currentDate}/${currentMonth + 1 < 10 ? '0' : ''}${currentMonth}/${currentYear}`,
        time: `${currentDay.getHours() < 10 ? '0' : ''}${currentDay.getHours()}:${currentDay.getMinutes() < 10 ? '0' : ''}${currentDay.getMinutes()}`,
    };
}
