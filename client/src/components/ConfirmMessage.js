import React from 'react';
import '../sass/confirmMessage.scss';

const ConfirmMessage = ({ type, name }) => {
    return (
        <div className='confirm-msg-container'>
            <span className='done'>Done!</span>
            <span className='msg'>You have successfully added a {type} customer account for</span>
            <span className='name'>{name}.</span>
        </div>
    )
}

export default ConfirmMessage