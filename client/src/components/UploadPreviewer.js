import React, { useState } from 'react';
import Remove from '../assets/color/ic_Decline Fill.svg'
import '../sass/uploadPreviewer.scss'
import PreviewModal from './PreviewModal';
import { EyeIconWhite } from '../components/SVG_Icons';
import { setTrackForm } from '../utils/Functions';

const UploadPreviewer = ({ title, value, onRemove, disabled, className = '', track, error = '' }) => {

    const [modal, setModal] = useState(false)

    const handleRemove = () => {
        track && setTrackForm()
        onRemove()
    }

    return (
        <div className={`item-container ${className}`}>
            <span>{title}</span>
            <div className='img-container'>
                {value && <img src={value} alt='' />}
                {!disabled && value && <img className='cross' src={Remove} onClick={handleRemove} alt='' />}
                {value && <EyeIconWhite className='eye' onClick={() => setModal(true)} />}
                {error && <span className='preview-error'>{error}</span>}
                {value && <div className='image-shadow'></div>}
            </div>
            <PreviewModal data={value} visible={modal} onCancel={() => setModal(false)} />
        </div>
    )
}

export default UploadPreviewer