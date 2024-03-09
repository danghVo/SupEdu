import validInput from './validInput';

const validFunc = (value: number) => (checkedData: string) =>
    validInput(parseInt(checkedData) < value, `Không được bé hơn ${value}`);

export default (value: number) => ({ valid: validFunc(value) });
