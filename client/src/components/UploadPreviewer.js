import React, { useState } from 'react';
import { EyeOutlined } from '@ant-design/icons'
import Remove from '../assets/color/ic_Decline Fill.svg'
import '../sass/uploadPreviewer.scss'
import PreviewModal from './PreviewModal';
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
                {value && <EyeOutlined onClick={() => setModal(true)} />}
                {error && <span className='preview-error'>{error}</span>}
            </div>
            <PreviewModal data={value} visible={modal} onCancel={() => setModal(false)} />
        </div>
    )
}

export default UploadPreviewer