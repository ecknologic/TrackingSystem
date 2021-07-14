import React from 'react';
import BackButton from '../../../components/BackButton';
import '../../../sass/accounts.scss'

const Header = ({ data, onClick }) => {
    const { address, title } = data

    return (
        <div className='account-view-header'>
            <div className='heading-container'>
                <BackButton onClick={onClick} />
                <div className='titles-container'>
                    <>
                        <span className='title clamp-1'>{title}</span>
                        <span className='address clamp-1'>{address}</span>
                    </>
                </div>
            </div>
        </div>
    )

}

export default Header