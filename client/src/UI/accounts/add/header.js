import React from 'react';
import BackButton from '../../../components/BackButton';
import '../../../sass/accounts.scss'


const Header = ({ onClick, hideBack }) => {
    return (
        <div className='account-add-header'>
            <div className='heading-container'>
                {!hideBack && <BackButton onClick={onClick} />}
                <div className='titles-container'>
                    <span className='title'>Create Account</span>
                </div>
            </div>
        </div>
    )

}

export default Header