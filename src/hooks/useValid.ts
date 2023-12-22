import { useState } from 'react';

interface rule {
    valid: (checkedData: string) => { message: string; isValid: boolean };
}

function useValid(checkedData: string, rules: Array<rule>) {
    const [message, setMessage] = useState('');

    const valid = () => {
        let violate = false;

        rules.forEach((rule) => {
            const checkResult = rule.valid(checkedData);
            if (!checkResult.isValid && !violate) {
                setMessage(checkResult.message);

                violate = true;
            }
        });

        if (!violate) {
            setMessage('');
        }
    };

    return { valid, message };
}

export default useValid;
