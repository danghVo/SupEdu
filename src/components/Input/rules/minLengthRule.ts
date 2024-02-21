import validInput from './validInput';

const valid = (length: number) => (checkedData: string) =>
    validInput(checkedData.length < length, `Phải có ít nhất ${length} kí tự`);

export default (length: number) => ({ valid: valid(length) });
