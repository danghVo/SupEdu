import validInput from './validInput';

const valid = (checkedData: string) => validInput(!checkedData.match(/^\d*$/), 'Must be number');

export default { valid };
