import { useEffect, useState } from 'react';

function useDebounce(value: string, delay: number) {
    const [debounceValue, setDebounceValue] = useState('');

    useEffect(() => {
        const handleDebounce = setTimeout(() => setDebounceValue(value), delay);

        return () => clearTimeout(handleDebounce);
    }, [value]);

    return debounceValue;
}

export default useDebounce;
