import React, { useState } from 'react';
import PreviewModal from './PreviewModal';
import UploadInput from './UploadInput';
import { setTrackForm } from '../utils/Functions';
import { EyeIconWhite, CloseIconRed } from '../components/SVG_Icons';
import '../sass/uploadPreviewer.scss'

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
                    {!disabled && <CloseIconRed className='cross' onClick={handleRemove} />}
                    <EyeIconWhite className='eye' onClick={() => setModal(true)} />
                    <div className='image-shadow'></div>
                </div>
                    : <UploadInput onUpload={onUpload} disabled={disabled}>
                        {error && <span className='preview-error'>{error}</span>}
                        <div></div>
                    </UploadInput>
            }

            <PreviewModal data={value} visible={modal} onCancel={() => setModal(false)} />
        </div>
    )
}

export default UploadPreviewer