import React from 'react';
import NameCard from './NameCard';
import '../sass/revisitCard.scss';

const RevisitCard = ({ title, total, onClick }) => {

    return (
        <div className='revisit-card-container'>
            <div className='revisit-title'>
                <span>{'Revisit Date: 23/03/2020'}</span>
            </div>
            <div className='business'>
                <span className='type1'>{'Exile Infotech'}</span>
                <span className='value clamp-1'>{'Sriram Nagar, Madhapur'}</span>
            </div>
            <div className='business'>
                <span className='type1'>Account Type</span>
                <span className='value'>{'Business'}</span>
            </div>
            <div className='contact-container'>
                <span className='type1'>Contact Details</span>
                <div className='contacts'>
                    <NameCard name={'Dilip'} />
                    <span className='mobile'>{'9393839383'}</span>
                </div>
            </div>
        </div>
    )
}

export default RevisitCard