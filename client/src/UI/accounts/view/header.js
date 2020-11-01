import React from 'react';
import { useHistory } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import '../../../sass/accounts.scss'


const Header = () => {
    const history = useHistory()

    const handleBack = () => history.push('/manage-accounts')

    return (
        <div className='account-view-header'>
            <div className='heading-container'>
                <BackButton onClick={handleBack} />
                <div className='titles-container'>
                    <span className='title'>Vijaya Diagnostic Centre</span>
                    <span className='address'>Punjagutta, Hyderabad, Telangana, India</span>
                </div>
            </div>
        </div>
    )

}

export default Header