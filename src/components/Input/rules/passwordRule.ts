import validInput from './validInput';

const valid = (checkedData: string) =>
    validInput(
        !checkedData.match(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[@!#$%&])(?=.*\d).*$/g),
        'Ít nhất một kí tự số, in hoa, kí tự đặc biệt và dài hơn 8 kí tự',
    );

export default { valid };
