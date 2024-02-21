import validInput from './validInput';

const valid = (value: number) => (checkedData: number) =>
    validInput(checkedData > value, `Không được lớn hơn ${value}`);

export default (value: number) => ({ valid: valid(value) });
