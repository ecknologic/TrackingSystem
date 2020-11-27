import React, { useState } from 'react';
import Remove from '../assets/color/ic_Decline Fill.svg'
import '../sass/uploadPreviewer.scss'
import PreviewModal from './PreviewModal';
import { EyeIconWhite } from '../components/SVG_Icons';
import { setTrackForm } from '../utils/Functions';
import UploadInput from './UploadInput';

const UploadPreviewer = ({ title, value, onUpload, onRemove, disabled, className = '', track, error = '' }) => {

    const [modal, setModal] = useState(false)

    const handleRemove = () => {
        track && setTrackForm()
        onRemove()
    }

    return (
        <div className={`item-container ${className}`}>
            <span className='title'>{title}</span>
            {
                value ? <div className='img-container'>
                    <img src={value} alt='' />
                    {!disabled && <img className='cross' src={Remove} onClick={handleRemove} alt='' />}
                    <EyeIconWhite className='eye' onClick={() => setModal(true)} />
                    <div className='image-shadow'></div>
                </div>
                    : <UploadInput onUpload={onUpload}>
                        {error && <span className='preview-error'>{error}</span>}
                        {!value && <div></div>}
                    </UploadInput>
            }

            <PreviewModal data={value} visible={modal} onCancel={() => setModal(false)} />
        </div>
    )
}

export default UploadPreviewer