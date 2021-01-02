import React from 'react';
import BackButton from '../../../components/BackButton';
import Spinner from '../../../components/Spinner';
import '../../../sass/accounts.scss'

const Header = ({ data, onClick }) => {
    const { title, customertype, loading } = data

    return (
        <div className='account-view-header'>
            <div className='heading-container'>
                <BackButton onClick={onClick} />
                <div className='title-container'>
                    {
                        loading ? <Spinner />
                            : (
                                <>
                                    <span className='title clamp-1'>{title}</span>
                                    <span className='account'>{`- ${customertype} Account`}</span>
                                </>
                            )
                    }
                </div>
            </div>
        </div>
    )

}

export default Header