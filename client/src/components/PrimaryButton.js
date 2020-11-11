import React from 'react';
import '../sass/primaryButton.scss'

const PrimaryButton = ({ text, onClick, disabled }) => {

    return (
        <button className='primary-button-container' onClick={onClick} disabled={disabled}>
            <span>{text}</span>
        </button>
    )
}

export default PrimaryButton