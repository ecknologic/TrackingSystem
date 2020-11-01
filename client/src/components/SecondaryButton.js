import React from 'react';
import { FileTextOutlined } from '@ant-design/icons'
import '../sass/secondaryButton.scss'

const SecondaryButton = ({ text, onClick }) => {

    return (
        <div className='secondary-button-container' onClick={onClick}>
            <FileTextOutlined />
            <span className='text' >{text}</span>
        </div>
    )
}

export default SecondaryButton