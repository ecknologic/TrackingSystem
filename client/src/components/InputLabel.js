import React from 'react';

const InputLabel = ({ name, error, mandatory }) => {
    return (
        <div>
            <label className={`app-input-label-name ${mandatory ? 'label-mandatory' : ''}`}>{name}</label>
            {error && <span className='app-label-error'>{error}</span>}
        </div>
    )
}

export default InputLabel