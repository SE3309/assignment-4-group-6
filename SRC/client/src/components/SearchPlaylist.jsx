import React, { useState } from 'react';
import UserHeader from './UserHeader';
const SearchPlaylist = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        // Replace with your search logic
        const response = await fetch(`/api/search?query=${query}`);
        const data = await response.json();
        setResults(data);
    };

    return (
        <div>
            <UserHeader />
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a playlist"
                />
                <button type="submit">Search</button>
            </form>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>{result.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchPlaylist;