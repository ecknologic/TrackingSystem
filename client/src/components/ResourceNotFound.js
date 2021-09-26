import React from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import DrinkIcon from '../assets/color/drink.svg'
import CustomButton from './CustomButton'
import '../sass/resourceNotFound.scss'

const ResourceNotFound = () => {
    const { state } = useLocation()
    const { entity = 'content' } = state || {}
    const history = useHistory()

    const goHome = () => history.push('/')

    const goBack = () => history.goBack()

    return (
        <div className='resource-not-found-container'>
            <div className='image'>
                <img src={DrinkIcon} alt='' />
            </div>
            <div className='content'>
                <div className='text-wrapper'>
                    <h3 className='title'>The {entity} you are looking for could not be found.</h3>
                    <p className='info'>The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                </div>
                <div className='btns-wrapper'>
                    <CustomButton onClick={goBack} className='app-cancel-btn back-btn' text='Back' />
                    <CustomButton onClick={goHome} className='app-create-btn' text='Home' />
                </div>
            </div>
        </div>
    )
}

export default ResourceNotFound