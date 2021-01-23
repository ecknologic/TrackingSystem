import React from 'react';

const InputLabel = ({ name, error, errClass = '', mandatory }) => {
    return (
        <div>
            <label className={`app-input-label-name ${mandatory ? 'label-mandatory' : ''}`}>{name}</label>
            {error && <span className={`app-label-error ${errClass}`}>{error}</span>}
        </div>
    )
}

export default InputLabel