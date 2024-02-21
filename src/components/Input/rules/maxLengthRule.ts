import validInput from './validInput';

const valid = (length: number) => (checkedData: string) =>
    validInput(checkedData.length > length, `Tối đa ${length} ký tự`);

export default (length: number) => ({ valid: valid(length) });
