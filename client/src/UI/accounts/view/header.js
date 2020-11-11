import React from 'react';
import { useHistory } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import Spinner from '../../../components/Spinner';
import '../../../sass/accounts.scss'

const Header = ({ data }) => {
    const { address, title, loading } = data
    const history = useHistory()

    const handleBack = () => history.push('/manage-accounts')

    return (
        <div className='account-view-header'>
            <div className='heading-container'>
                <BackButton onClick={handleBack} />
                <div className='titles-container'>
                    {
                        loading ? <Spinner />
                            : (
                                <>
                                    <span className='title'>{title}</span>
                                    <span className='address'>{address}</span>
                                </>
                            )
                    }
                </div>
            </div>
        </div>
    )

}

export default Header