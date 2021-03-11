import React, { useEffect, useState } from 'react';
import { SearchIconGrey } from './SVG_Icons';
import '../sass/searchInput.scss'
const fn = () => { }

const SearchInput = ({ placeholder, onSearch = fn, onChange = fn, width = '300px', className, reset }) => {
    const [input, setInput] = useState('')

    useEffect(() => {
        setInput('')
    }, [reset])

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
        }
    }

    return (
        <div className={`search-input-container ${className}`} style={{ width }}>
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