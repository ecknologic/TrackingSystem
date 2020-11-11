import React from 'react';
import '../sass/backButton.scss'

const BackButton = ({ onClick }) => {

    return (
        <div className='back-button-container' >
            <span className='back' onClick={onClick}>&#8592;</span>
            <span className='text' onClick={onClick}>Back</span>
        </div>
    )
}

export default BackButton