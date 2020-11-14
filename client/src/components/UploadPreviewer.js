import React, { useState } from 'react';
import { EyeOutlined } from '@ant-design/icons'
import Remove from '../assets/color/ic_Decline Fill.svg'
import '../sass/uploadPreviewer.scss'
import PreviewModal from './PreviewModal';

const UploadPreviewer = ({ title, value, onRemove, disabled }) => {

    const [modal, setModal] = useState(false)

    return (
        <div className='item-container first'>
            <span>{title}</span>
            <div className='img-container'>
                {value ? <img src={value} alt='' /> : null}
                {!disabled && value && <img className='cross' src={Remove} onClick={onRemove} alt='' />}
                {value && <EyeOutlined onClick={() => setModal(true)} />}
            </div>
            <PreviewModal data={value} visible={modal} onCancel={() => setModal(false)} />
        </div>
    )
}

export default UploadPreviewer