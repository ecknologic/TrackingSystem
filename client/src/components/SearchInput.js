import React, { useState } from 'react';
import { SearchIconGrey } from './SVG_Icons';
import '../sass/searchInput.scss'

const SearchInput = ({ placeholder, onSearch, width = '300px', onChange }) => {
    const [input, setInput] = useState('')

    const handleChange = ({ currentTarget: { value } }) => {
        setInput(value)
        onChange(value.trim())
    }

    const handleEnter = ({ keyCode }) => {
        if (keyCode === 13) { // Enter key
            handleSearch()
        }
    }

    const handleSearch = () => {
        if (input) {
            input.trim() && onSearch(input)
            setInput('')
        }
    }

    return (
        <div className='search-input-container' style={{ width }}>
            <input
                value={input}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleEnter}
            />
            <SearchIconGrey className='search' onClick={handleSearch} />
        </div>
    )
}

export default SearchInput