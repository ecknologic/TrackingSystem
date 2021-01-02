import React from 'react';
import '../sass/successMessage.scss';

const SuccessMessage = ({ type, name, action }) => {
    return (
        <div className='success-msg-container'>
            <span className='done'>Done!</span>
            <span className='msg'>You have successfully {action} {type} customer account for</span>
            <span className='name'>{name}.</span>
        </div>
    )
}

export default SuccessMessage