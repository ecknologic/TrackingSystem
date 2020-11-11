import React from 'react';
import Remove from '../assets/color/ic_Decline Fill.svg'
import '../sass/uploadPreviewer.scss'

const UploadPreviewer = ({ title, value, onRemove, disabled }) => {

    return (
        <div className='item-container first'>
            <span>{title}</span>
            <div className='img-container'>
                {value ? <img src={value} alt='' /> : null}
                {!disabled && value && <img className='cross' src={Remove} onClick={onRemove} alt='' />}
            </div>
        </div>
    )
}

export default UploadPreviewer