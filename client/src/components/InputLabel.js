import React from 'react';

const InputLabel = ({ name, error }) => {
    return (
        <div>
            <label className='app-input-label-name'>{name}</label>
            {error && <span className='app-label-error'>{error}</span>}
        </div>
    )
}

export default InputLabel