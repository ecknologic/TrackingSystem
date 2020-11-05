import React from 'react';
import '../sass/customButton.scss'

const SecondaryButton = ({ text, onClick, icon, className = '', style }) => {

    return (
        <div className={`custorm-btn-container ${className}`} onClick={onClick} style={style}>
            {icon}
            <span className='text' >{text}</span>
        </div>
    )
}

export default SecondaryButton