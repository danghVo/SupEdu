import validInput from './validInput';

const valid = (checkedData: string) =>
    validInput(
        !checkedData.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/) &&
            !checkedData.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/),
        'Không đúng định dạng link hoặc class ID',
    );

export default { valid };
