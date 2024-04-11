import validInput from './validInput';

const valid = (checkedData: string) =>
    validInput(
        !checkedData.match(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[@!#$%&? ";:<>.,\/\[\]\{\}|+-_()]).*$/g),
        'Ít nhất một kí tự số, in hoa, kí tự đặc biệt',
    );

export default { valid };
