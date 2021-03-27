import React from 'react';

const CustomButton = ({ text, onClick, icon, suffix, className = '', style, disabled }) => {

    return (
        <div className={`app-btn ${className} ${disabled ? 'disabled' : ''}`} onClick={onClick} style={style}>
            { icon && <span className='prefix'>{icon}</span>}
            <span className='text' >{text}</span>
            { suffix && <span className='suffix'>{suffix}</span>}
        </div>
    )
}

export default CustomButton