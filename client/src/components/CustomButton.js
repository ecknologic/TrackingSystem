import React from 'react';

const CustomButton = ({ text, onClick, icon, suffix, className = '', style }) => {

    return (
        <div className={`app-btn ${className}`} onClick={onClick} style={style}>
            {icon}
            <span className='text' >{text}</span>
            {suffix}
        </div>
    )
}

export default CustomButton