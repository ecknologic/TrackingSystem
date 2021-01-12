import React from 'react';
import BackButton from '../../../components/BackButton';
import '../../../sass/accounts.scss'

const Header = ({ data, onClick }) => {
    const { title } = data

    return (
        <div className='account-view-header'>
            <div className='heading-container'>
                <BackButton onClick={onClick} />
                <div className='title-container'>
                    {
                        title && <span className='title clamp-1'>{title}</span>
                    }
                </div>
            </div>
        </div>
    )

}

export default Header