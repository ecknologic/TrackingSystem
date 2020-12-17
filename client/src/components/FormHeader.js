import React from 'react';
import dayjs from 'dayjs'
import '../sass/formHeader.scss'

const FormHeader = ({ title }) => {

    return (
        <div className='form-header-container'>
            <span className='title'>{title}</span>
            <span className='date'>{dayjs().format('DD/MM/YYYY')}</span>
            <span className='time' >{dayjs().format('hh:mm A')}</span>
        </div>
    )
}

export default FormHeader