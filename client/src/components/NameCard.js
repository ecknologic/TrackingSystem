import React from 'react';
import AvatarText from './AvatarText';
import '../sass/nameCard.scss'

const NameCard = ({ name = '', extra }) => {

    return (
        <div className='name-card-container'>
            <AvatarText name={name} />
            <span className='name clamp-1'>{name}</span>
            {extra}
        </div>
    )
}

export default NameCard