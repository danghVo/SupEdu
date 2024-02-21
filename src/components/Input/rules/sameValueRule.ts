import validInput from './validInput';

const valid = (sameValue: string, message: string) => (checkedData: string) =>
    validInput(checkedData !== sameValue, message);

export default (sameValue: string, message: string) => ({ valid: valid(sameValue, message) });
