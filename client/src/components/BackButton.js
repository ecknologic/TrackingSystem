import React from 'react';
import { ArrowIcon } from './SVG_Icons'
import '../sass/backButton.scss'

const BackButton = ({ onClick }) => {

    return (
        <div className='back-button-container' onClick={onClick} >
            <ArrowIcon className='arrow' />
            <span className='text' >Back</span>
        </div>
    )
}

export default BackButton