import React from 'react';
import AvatarText from './AvatarText';
import '../sass/nameCard.scss'

const NameCard = ({ name = '' }) => {

    return (
        <div className='name-card-container'>
            <AvatarText name={name} />
            <span className='name'>{name}</span>
        </div>
    )
}

export default NameCard