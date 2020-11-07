import React from 'react';

const CustomButton = ({ text, onClick, icon, className = '', style }) => {

    return (
        <div className={`app-btn ${className}`} onClick={onClick} style={style}>
            {icon}
            <span className='text' >{text}</span>
        </div>
    )
}

export default CustomButton