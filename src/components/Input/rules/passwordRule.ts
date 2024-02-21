import validInput from './validInput';

const valid = (checkedData: string) =>
    validInput(!checkedData.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/), 'Ít nhất một kí tự số, in hoa, in thường');

export default { valid };
