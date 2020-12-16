import React from 'react';
import '../sass/formHeader.scss'

const FormHeader = ({ title }) => {

    return (
        <div className='form-header-container'>
            <span className='title'>{title}</span>
            <span className='date'>24/09/2020</span>
            <span className='time' >12:45 AM</span>
        </div>
    )
}

export default FormHeader