import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from './Search.module.scss';
import useDebounce from '~/hooks/useDebounce';
import Input from '../Input';

const cs = classNames.bind(styles);

export default function Search({
    className = '',
    handleSearch,
}: {
    className?: string;
    handleSearch: (value: string) => void;
}) {
    const [searchText, setSearchText] = useState('');

    const debounceSearch = useDebounce(searchText, 500);

    useEffect(() => {
        handleSearch(debounceSearch);
    }, [debounceSearch]);

    const handleInput = (value: string) => {
        setSearchText(value);
    };

    return (
        <div className={`shadow-custom-4 h-fit rounded-lg ${className}`}>
            <Input value={searchText} onChange={handleInput} classNameWrapper="rounded-lg" placeholder="Tìm kiếm..." />
        </div>
    );
}
