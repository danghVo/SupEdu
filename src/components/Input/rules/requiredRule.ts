import validInput from './validInput';

const valid = (checkedData: string) => validInput(checkedData === '', 'Không được để trống');

export default { valid };
