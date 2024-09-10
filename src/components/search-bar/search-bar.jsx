import { useState, useCallback } from 'react';
import { Input } from 'antd';
import { debounce } from 'lodash';
import './search-bar.css';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch(query);
    }, 1000),
    [onSearch]
  );

  const handleChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    debouncedSearch(newSearchQuery);
  };

  return (
    <div className="search-bar">
      <Input placeholder="Type to search..." value={searchQuery} onChange={handleChange} />
    </div>
  );
};

export default SearchBar;
