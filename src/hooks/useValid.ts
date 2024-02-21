import { useEffect, useState } from 'react';

interface rule {
    valid: (checkedData: string) => { message: string; isValid: boolean };
}

function useValid(checkedData: string, rules: Array<rule>) {
    const [message, setMessage] = useState('');

    useEffect(() => {
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
    }, [checkedData]);

    return { message };
}

export default useValid;
