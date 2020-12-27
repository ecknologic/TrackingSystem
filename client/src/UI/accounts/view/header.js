import React from 'react';
import { useHistory } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import Spinner from '../../../components/Spinner';
import '../../../sass/accounts.scss'

const Header = ({ data, onClick }) => {
    const { address, title, loading } = data

    return (
        <div className='account-view-header'>
            <div className='heading-container'>
                <BackButton onClick={onClick} />
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