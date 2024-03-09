import validInput from './validInput';

const valid = (checkedData: string) =>
    validInput(!checkedData.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/), 'Không đúng định dạng email');

export default { valid };
