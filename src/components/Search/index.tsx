import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from './Search.module.scss';
import useDebounce from '~/hooks/useDebounce';
import Input from '../Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const cs = classNames.bind(styles);

export default function Search({
    className = '',
    placeholder = 'Tìm kiếm...',
    handleSearch,
}: {
    className?: string;
    placeholder?: string;
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
        <div className={`shadow-custom-4 h-fit rounded-xl flex overflow-hidden ${className}`}>
            <div className="w-[25px] flex items-center justify-end bg-white pl-[32px]">
                <FontAwesomeIcon icon={faSearch} />
            </div>
            <div className="grow">
                <Input
                    value={searchText}
                    onChange={handleInput}
                    classNameWrapper="rounded-none shadow-none"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}
