export default function checkTimeExprire(time: string, date: string) {
    const dateSplit = date.split('/');
    const milisecond = new Date(`${time} ${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`).valueOf();
    const now = Date.now();
    if (now > milisecond) {
        return true;
    } else return false;
}
