import React from 'react';
import BackButton from '../../../components/BackButton';
import '../../../sass/accounts.scss'


const Header = ({ onClick }) => {
    return (
        <div className='account-add-header'>
            <div className='heading-container'>
                <BackButton onClick={onClick} />
                <div className='titles-container'>
                    <span className='title'>Create Account</span>
                </div>
            </div>
        </div>
    )

}

export default Header