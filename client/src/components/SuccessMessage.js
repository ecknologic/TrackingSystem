import React from 'react';
import '../sass/successMessage.scss';

const SuccessMessage = ({ type, name }) => {
    return (
        <div className='success-msg-container'>
            <span className='done'>Done!</span>
            <span className='msg'>You have successfully added a {type} customer account for</span>
            <span className='name'>{name}.</span>
        </div>
    )
}

export default SuccessMessage