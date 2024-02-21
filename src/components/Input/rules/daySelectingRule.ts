import validInput from './validInput';

const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const valid = (fromDay: string) => (checkedData: string) =>
    validInput(dayName.indexOf(checkedData) < dayName.indexOf(fromDay), `Ngày kết thúc bán phải lớn hơn ngày bắt đầu`);

export default (fromDay: string) => ({ valid: valid(fromDay) });
